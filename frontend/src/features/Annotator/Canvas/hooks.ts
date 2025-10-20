import { useAnnotatorCanvasContext } from './context';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAnnotatorZoom } from '@/features/Annotator/Zoom';
import { useAnnotatorSpectrogram } from '@/features/Annotator/Spectrogram';
import { useAnnotatorVisualConfiguration } from '@/features/Annotator/VisualConfiguration';
import { useAnnotatorTempAnnotation } from '@/features/Annotator/Annotation';
import { useAnnotatorWindow } from '@/features/Annotator/Canvas/window.hooks';
import { useAnnotationTask } from '@/api';
import { useAnnotatorPointer } from '@/features/Annotator/Pointer';
import { useAudio } from '@/features/Audio';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useTimeAxis } from '@/features/Annotator/Axis';

export const useAnnotatorCanvas = () => {
  const {
    window, setWindow,
    mainCanvas, setMainCanvas,
    xAxisCanvas, setXAxisCanvas,
    yAxisCanvas, setYAxisCanvas,
  } = useAnnotatorCanvasContext()
  const { analysis } = useAnnotatorAnalysis()
  const { task } = useAnnotationTask()
  const { width, height, yAxisWidth, containerWidth } = useAnnotatorWindow()
  const { drawSpectrogram } = useAnnotatorSpectrogram()
  const { zoom, zoomOrigin } = useAnnotatorZoom()
  const {
    applyFilter,
    applyColormap,
    colormap,
    isColormapReversed,
    brightness,
    contrast,
  } = useAnnotatorVisualConfiguration()
  const { drawTempAnnotation, tempAnnotation } = useAnnotatorTempAnnotation()
  const { isHoverCanvas, getFreqTime, setPosition } = useAnnotatorPointer()
  const { time } = useAudio()
  const { timeScale } = useTimeAxis()

  const draw = useCallback(async () => {
    const context = mainCanvas?.getContext('2d', { alpha: false });
    if (!context) return;

    // Reset
    context.clearRect(0, 0, width, height);

    applyFilter(context)
    await drawSpectrogram(context)
    applyColormap(context)
    drawTempAnnotation(context)
  }, [ mainCanvas, width, height, drawSpectrogram, applyFilter, applyColormap, drawTempAnnotation ]);

  const download = useCallback(async (filename: string) => {
    const link = document.createElement('a');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get fake canvas 2D context');

    // Get spectro images
    await draw()
    const spectroDataURL = mainCanvas?.toDataURL('image/png');
    if (!spectroDataURL) throw new Error('Cannot recover spectro dataURL');
    draw()
    const spectroImg = new Image();

    // Get frequency scale
    const freqDataURL = yAxisCanvas?.toDataURL('image/png');
    if (!freqDataURL) throw new Error('Cannot recover frequency dataURL');
    const freqImg = new Image();

    // Get timescale
    const timeDataURL = xAxisCanvas?.toDataURL('image/png');
    if (!timeDataURL) throw new Error('Cannot recover time dataURL');
    const timeImg = new Image();

    // Compute global canvas
    /// Load images
    await new Promise((resolve, reject) => {
      let isSpectroLoaded = false;
      let isFreqLoaded = false;
      let isTimeLoaded = false;
      spectroImg.onerror = e => reject(e)
      freqImg.onerror = e => reject(e)
      timeImg.onerror = e => reject(e)

      spectroImg.onload = () => {
        isSpectroLoaded = true;
        if (isFreqLoaded && isTimeLoaded) resolve(true);
      }
      freqImg.onload = () => {
        isFreqLoaded = true;
        if (isSpectroLoaded && isTimeLoaded) resolve(true);
      }
      timeImg.onload = () => {
        isTimeLoaded = true;
        if (isSpectroLoaded && isFreqLoaded) resolve(true);
      }

      spectroImg.src = spectroDataURL;
      freqImg.src = freqDataURL;
      timeImg.src = timeDataURL;
    });
    canvas.height = timeImg.height + spectroImg.height;
    canvas.width = freqImg.width + spectroImg.width;

    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.drawImage(spectroImg, yAxisWidth, 0, spectroImg.width, spectroImg.height);
    context.drawImage(freqImg, 0, 0, freqImg.width, freqImg.height);
    context.drawImage(timeImg, yAxisWidth, height, timeImg.width, timeImg.height);

    const canvasData = canvas.toDataURL('image/png')

    if (!canvasData) return;
    link.href = canvasData;
    link.target = '_blank';
    link.download = filename;
    link.click();
  }, [ xAxisCanvas, yAxisCanvas, mainCanvas, height, zoom, yAxisWidth, draw ])

  const focusTime = useCallback((time: number) => {
    const left = timeScale.valueToPosition(time) - containerWidth / 2;
    mainCanvas?.parentElement?.scrollTo({ left })
  }, [ timeScale, mainCanvas ])

  // Global updates
  useEffect(() => {
    draw()
  }, [
    // On current newAnnotation changed
    tempAnnotation?.end_time, tempAnnotation?.end_frequency, tempAnnotation,
    // On Spectrogram or analysis changed
    task?.spectrogram, analysis,
    // On colormap changed
    colormap, isColormapReversed, brightness, contrast,
  ])

  // Manage time update
  const currentTime = useRef<number>(0)
  useEffect(() => {
    // Scroll if progress bar reach the right edge of the screen
    if (!window || !task?.spectrogram) return;
    const oldX: number = Math.floor(width * currentTime.current / task.spectrogram.duration);
    const newX: number = Math.floor(width * time / task.spectrogram.duration);

    if ((oldX - window.scrollLeft) < containerWidth && (newX - window.scrollLeft) >= containerWidth) {
      window.scrollLeft += containerWidth;
    }
    currentTime.current = time;
  }, [
    // On time changed
    time, task?.spectrogram.duration,
  ])

  // Manage zoom update
  const [ _zoom, _setZoom ] = useState<number>(1);
  useEffect(() => {
    const mainBounds = mainCanvas?.getBoundingClientRect()
    if (!window || !task?.spectrogram || !mainBounds) return;

    // If zoom factor has changed
    if (zoom === _zoom) return;
    // New timePxRatio
    const newTimePxRatio: number = containerWidth * zoom / task.spectrogram.duration;

    // Compute new center (before resizing)
    let newCenter: number;
    if (zoomOrigin) {
      // x-coordinate has been given, center on it
      newCenter = (zoomOrigin.x - mainBounds.left) * zoom / _zoom;
      const coords = {
        clientX: zoomOrigin.x,
        clientY: zoomOrigin.y,
      }
      if (isHoverCanvas(coords)) {
        const data = getFreqTime(coords);
        if (data) setPosition(data)
      }
    } else {
      // If no x-coordinate: center on currentTime
      newCenter = currentTime.current * newTimePxRatio;
    }
    window.scrollTo({ left: Math.floor(newCenter - containerWidth / 2) })
    _setZoom(zoom);
    draw()
  }, [
    // On zoom updated
    zoom, task?.spectrogram.duration,
  ]);

  return {
    window, setWindow,
    mainCanvas, setMainCanvas,
    xAxisCanvas, setXAxisCanvas,
    yAxisCanvas, setYAxisCanvas,

    draw,
    download,
    focusTime,
  }
}
