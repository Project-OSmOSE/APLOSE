import { useCallback, useRef } from 'react';
import { useAnnotatorZoom } from '@/features/Annotator/Zoom';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useAnnotationTask } from '@/api';
import { useToast } from '@/components/ui';
import { useAnnotatorWindow } from '@/features/Annotator/Canvas';
import { useTimeAxis } from '@/features/Annotator/Axis';

export const useAnnotatorSpectrogram = () => {
  const { task } = useAnnotationTask()
  const { analysis } = useAnnotatorAnalysis()
  const { zoom } = useAnnotatorZoom()
  const { height } = useAnnotatorWindow()
  const { timeScale } = useTimeAxis()
  const toast = useToast()
  const images = useRef<Map<number, Array<HTMLImageElement | undefined>>>(new Map);
  const failedImagesSources = useRef<string[]>([])

  const areAllImagesLoaded = useCallback((): boolean => {
    return images.current.get(zoom)?.filter(i => !!i).length === zoom
  }, [ zoom ])

  const loadImages = useCallback(async () => {
    if (!analysis || !task?.spectrogram?.path) {
      images.current = new Map();
      return;
    }
    if (areAllImagesLoaded()) return;

    const filename = task.spectrogram.filename
    return Promise.all(
      Array.from(new Array<HTMLImageElement | undefined>(zoom)).map(async (_, index) => {
        let src = task.spectrogram?.path;
        if (!src) return;
        if (analysis.legacy) {
          src = `${ src.split(filename)[0] }_${ zoom }_${ index }${ src.split(filename)[1] }`
        }
        if (failedImagesSources.current.includes(src)) return;
        console.info(`Will load for zoom ${ zoom }, image ${ index }`)
        const image = new Image();
        image.src = src;
        return await new Promise<HTMLImageElement | undefined>((resolve) => {
          image.onload = () => {
            console.info(`Image loaded: ${ image.src }`)
            resolve(image);
          }
          image.onerror = error => {
            failedImagesSources.current.push(src)
            toast.raiseError({
              message: `Cannot load spectrogram image with source: ${ image.src }`,
              error,
            })
            resolve(undefined);
          }
        })
      }),
    ).then(loadedImages => {
      images.current.set(zoom, loadedImages)
    })
  }, [ analysis, zoom, failedImagesSources, areAllImagesLoaded, task, analysis ])

  const drawSpectrogram = useCallback(async (context: CanvasRenderingContext2D) => {
    if (!areAllImagesLoaded()) await loadImages();
    if (!areAllImagesLoaded()) return;

    const currentImages = images.current.get(zoom)
    if (!currentImages || !task) return;
    for (const i in currentImages) {
      const index: number | undefined = i ? +i : undefined;
      if (index === undefined) continue;
      const start = index * task.spectrogram.duration / zoom;
      const end = (index + 1) * task.spectrogram.duration / zoom;
      const image = currentImages[index];
      if (!image) continue
      context.drawImage(
        image,
        timeScale.valueToPosition(start),
        0,
        Math.floor(timeScale.valuesToPositionRange(start, end)),
        height,
      )
    }
  }, [ images, zoom, task, timeScale, height, areAllImagesLoaded, loadImages ])

  return {
    drawSpectrogram,
  }
}
