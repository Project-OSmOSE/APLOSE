import { MutableRefObject, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import { AnnotationType } from "@/features/_utils_/gql/types.generated.ts";
import { colorSpectro, interpolate } from "@/service/ui/color.ts";
import { buildErrorMessage } from "@/service/function.ts";
import { useToast } from "@/service/ui";
import { useAnnotatorInput } from "./input.hook";
import { useAnnotatorQuery } from "./query.hook";
import { useAxis } from "./axis.hook";
import { Annotation } from "../slice";
import { AnnotatorAPI } from "../api";

export const useSpectrogramDisplay = (
  canvas?: MutableRefObject<HTMLCanvasElement | null>
) => {
  const { spectrogramID } = useParams<{ spectrogramID: string }>();
  const { data } = useAnnotatorQuery()
  const { zoom } = useAnnotatorInput()
  const {
    analysisID, analysis,
    brightness, contrast,
    colormap, invertedColormap,
  } = useAnnotatorInput()
  const context = useMemo(() => canvas?.current?.getContext('2d', { alpha: false }), [ canvas?.current ])
  const images = useRef<Map<number, Array<HTMLImageElement | undefined>>>(new Map);
  const failedSources = useRef<string[]>([])
  const { data: paths } = AnnotatorAPI.endpoints.getSpectrogramPath.useQuery({
    spectrogramID: spectrogramID ?? '',
    analysisID: analysisID ?? '',
  }, {
    skip: !analysisID || !spectrogramID,
  });
  const { xAxis, yAxis } = useAxis();
  const toast = useToast();

  useEffect(() => {
    return () => {
      toast.dismiss()
    }
  }, []);

  // Display
  const _areAllImagesLoaded = useCallback((): boolean => {
    return images.current.get(zoom)?.filter(i => !!i).length === zoom
  }, [ zoom ])
  const _loadImages = useCallback(async () => {
    if (!analysis || !paths?.spectrogramById?.path) {
      images.current = new Map();
      return;
    }
    if (_areAllImagesLoaded()) return;

    const filename = paths.spectrogramById.filename
    return Promise.all(
      Array.from(new Array<HTMLImageElement | undefined>(zoom)).map(async (_, index) => {
        let src = paths.spectrogramById?.path;
        if (!src) return;
        if (analysis.legacyConfiguration) {
          src = `${ src.split(filename)[0] }_${ zoom }_${ index }${ src.split(filename)[1] }`
        }
        if (failedSources.current.includes(src)) return;
        console.info(`Will load for zoom ${ zoom }, image ${ index }`)
        const image = new Image();
        image.src = src;
        return await new Promise<HTMLImageElement | undefined>((resolve) => {
          image.onload = () => {
            console.info(`Image loaded: ${ image.src }`)
            resolve(image);
          }
          image.onerror = e => {
            failedSources.current.push(src)
            console.error(`Cannot load spectrogram image with source: ${ image.src } [${ buildErrorMessage(e as any) }]`, e)
            toast.presentError(`Cannot load spectrogram image with source: ${ image.src } [${ buildErrorMessage(e as any) }]`)
            resolve(undefined);
          }
        })
      })
    ).then(loadedImages => {
      images.current.set(zoom, loadedImages)
    })
  }, [ analysis, zoom, images, failedSources, paths ])
  const resetDisplay = useCallback(() => {
    if (!canvas?.current || !context) return;
    context.clearRect(0, 0, canvas.current.width, canvas.current.height);
  }, [ canvas, context ])
  const display = useCallback(async () => {
    if (!canvas?.current || !context || !data?.spectrogramById) return;

    if (!_areAllImagesLoaded()) await _loadImages();
    if (!_areAllImagesLoaded()) return;

    // Filter images (filter must be set before drawing)
    const compBrightness: number = Math.round(interpolate(brightness, 0, 100, 50, 150));
    const compContrast: number = Math.round(interpolate(contrast, 0, 100, 50, 150));
    context.filter = `brightness(${ compBrightness.toFixed() }%) contrast(${ compContrast.toFixed() }%)`;

    // Draw images
    const currentImages = images.current.get(zoom)
    if (!currentImages) return;
    for (const i in currentImages) {
      const index: number | undefined = i ? +i : undefined;
      if (index === undefined) continue;
      const start = index * data.spectrogramById.duration / zoom;
      const end = (index + 1) * data.spectrogramById.duration / zoom;
      const image = currentImages[index];
      if (!image) continue
      context.drawImage(
        image,
        xAxis.valueToPosition(start),
        0,
        Math.floor(xAxis.valuesToPositionRange(start, end)),
        canvas.current.height
      )
    }

    // Color spectro images
    colorSpectro(canvas.current, colormap, invertedColormap);
  }, [ canvas, context, brightness, contrast, zoom, xAxis, colormap, invertedColormap ]);
  const displayAnnotation = useCallback((annotation: Pick<Annotation, 'type' | 'startTime' | 'startFrequency' | 'endFrequency' | 'endTime'>) => {
    if (!context || annotation.type !== AnnotationType.Box) return;
    context.strokeStyle = 'blue';
    context.strokeRect(
      xAxis.valueToPosition(Math.min(annotation.startTime!, annotation.endTime!)),
      yAxis.valueToPosition(Math.max(annotation.startFrequency!, annotation.endFrequency!)),
      Math.floor(xAxis.valuesToPositionRange(annotation.startTime!, annotation.endTime!)),
      yAxis.valuesToPositionRange(annotation.startFrequency!, annotation.endFrequency!)
    );
  }, [ context, xAxis, yAxis ])
  const updateDisplay = useCallback(async (annotation?: Pick<Annotation, 'type' | 'startTime' | 'startFrequency' | 'endFrequency' | 'endTime'>) => {
    resetDisplay()
    await display()
    if (annotation) displayAnnotation(annotation);
  }, [ resetDisplay, display, displayAnnotation ])

  return { resetDisplay, display, displayAnnotation, updateDisplay }
}