import { useCallback, useRef } from 'react';
import { selectZoom } from '@/features/Annotator/Zoom';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { useAnnotationTask } from '@/api';
import { useToast } from '@/components/ui';
import { useWindowHeight } from '@/features/Annotator/Canvas';
import { useTimeScale } from '@/features/Annotator/Axis';
import { useAppSelector } from '@/features/App';

export const useDrawSpectrogram = () => {
  const analysis = useAppSelector(selectAnalysis)
  const zoom = useAppSelector(selectZoom)
  const { spectrogram } = useAnnotationTask()
  const height = useWindowHeight()
  const timeScale = useTimeScale()
  const toast = useToast()
  const images = useRef<Map<number, Array<HTMLImageElement | undefined>>>(new Map);
  const failedImagesSources = useRef<string[]>([])

  const areAllImagesLoaded = useCallback((): boolean => {
    return images.current.get(zoom)?.filter(i => !!i).length === zoom
  }, [ zoom ])

  const loadImages = useCallback(async () => {
    if (!analysis || !spectrogram?.path) {
      images.current = new Map();
      return;
    }
    if (areAllImagesLoaded()) return;

    const filename = spectrogram.filename
    return Promise.all(
      Array.from(new Array<HTMLImageElement | undefined>(zoom)).map(async (_, index) => {
        let src = spectrogram?.path;
        if (!src) return;
        if (analysis.legacy) {
          src = `${ src.split(filename)[0] }${ filename }_${ zoom }_${ index }${ src.split(filename)[1] }`
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
  }, [ analysis, zoom, failedImagesSources, areAllImagesLoaded, spectrogram, analysis ])

  return useCallback(async (context: CanvasRenderingContext2D) => {
    if (!areAllImagesLoaded()) await loadImages();
    if (!areAllImagesLoaded()) return;

    const currentImages = images.current.get(zoom)
    if (!currentImages || !spectrogram) return;
    for (const i in currentImages) {
      const index: number | undefined = i ? +i : undefined;
      if (index === undefined) continue;
      const start = index * spectrogram.duration / zoom;
      const end = (index + 1) * spectrogram.duration / zoom;
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
  }, [ images, zoom, spectrogram, timeScale, height, areAllImagesLoaded, loadImages ])
}
