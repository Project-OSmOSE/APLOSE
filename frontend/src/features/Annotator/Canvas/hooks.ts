import { useAnnotatorCanvasContext } from './context';
import { useCallback } from 'react';
import { selectZoom } from '@/features/Annotator/Zoom';
import { useApplyColormap, useApplyFilter } from '@/features/Annotator/VisualConfiguration';
import { useDrawTempAnnotation } from '@/features/Annotator/Annotation';
import {
  useWindowContainerWidth,
  useWindowHeight,
  useWindowWidth,
  Y_AXIS_WIDTH,
} from '@/features/Annotator/Canvas/window.hooks';
import { useTimeScale } from '@/features/Annotator/Axis';
import { useAppSelector } from '@/features/App';


export const useFocusCanvasOnTime = () => {
  const timeScale = useTimeScale()
  const containerWidth = useWindowContainerWidth()
  const {
    mainCanvasRef,
  } = useAnnotatorCanvasContext()

  return useCallback((time: number) => {
    const left = timeScale.valueToPosition(time) - containerWidth / 2;
    mainCanvasRef?.current?.parentElement?.scrollTo({ left })
  }, [ timeScale, containerWidth ])
}

export const useDrawCanvas = () => {
  const width = useWindowWidth()
  const height = useWindowHeight()

  const drawTempAnnotation = useDrawTempAnnotation()
  const applyFilter = useApplyFilter()
  const applyColormap = useApplyColormap()

  const { mainCanvasRef } = useAnnotatorCanvasContext()

  return useCallback(async () => {
    const context = mainCanvasRef?.current?.getContext('2d');
    if (!context) return;

    // Reset
    context.clearRect(0, 0, width, height);

    // applyFilter(context)
    // applyColormap(context)
    drawTempAnnotation(context)
  }, [ width, height, applyFilter, applyColormap, drawTempAnnotation ]);
}

export const useDownloadCanvas = () => {
  const height = useWindowHeight()
  const zoom = useAppSelector(selectZoom)

  const draw = useDrawCanvas()

  const { xAxisCanvasRef, yAxisCanvasRef } = useAnnotatorCanvasContext()

  return useCallback(async (filename: string) => {
    const link = document.createElement('a');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Cannot get fake canvas 2D context');

    // Get spectro images
    await draw()
    const spectroDataURL = (document.getElementById('spectrogram') as HTMLCanvasElement)?.toDataURL('image/png');
    if (!spectroDataURL) throw new Error('Cannot recover spectro dataURL');
    draw()
    const spectroImg = new Image();

    // Get frequency scale
    const freqDataURL = yAxisCanvasRef?.current?.toDataURL('image/png');
    if (!freqDataURL) throw new Error('Cannot recover frequency dataURL');
    const freqImg = new Image();

    // Get timescale
    const timeDataURL = xAxisCanvasRef?.current?.toDataURL('image/png');
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

    context.drawImage(spectroImg, Y_AXIS_WIDTH, 0, spectroImg.width, spectroImg.height);
    context.drawImage(freqImg, 0, 0, freqImg.width, freqImg.height);
    context.drawImage(timeImg, Y_AXIS_WIDTH, height, timeImg.width, timeImg.height);

    const canvasData = canvas.toDataURL('image/png')

    if (!canvasData) return;
    link.href = canvasData;
    link.target = '_blank';
    link.download = filename;
    link.click();
  }, [ height, zoom, draw ])
}
