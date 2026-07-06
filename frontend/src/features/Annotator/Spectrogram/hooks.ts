import { useCallback, useEffect, useRef } from 'react';
import { selectZoom } from '@/features/Annotator/Zoom';
import { Toast } from '@/components/base/Toast';
import { useWindowHeight } from '@/features/Annotator/Canvas';
import { useTimeScale } from '@/features/Annotator/Axis';
import { useAppSelector } from '@/features/App';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useLoaderData } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { AnnotationSpectrogramAPI } from '@/features/AnnotationSpectrogram';

export const useDrawSpectrogram = () => {
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { selectedAnalysis } = useAnnotatorAnalysis()
    const zoom = useAppSelector(selectZoom)

    const {
        data: paths,
        refetch,
    } = useQuery({
        ...AnnotationSpectrogramAPI.getPathQuery({
            spectrogramID: spectrogram.id,
            analysisID: selectedAnalysis?.id ?? '',
        }),
        enabled: !!selectedAnalysis,
    });
    const height = useWindowHeight()
    const timeScale = useTimeScale()
    const toastManager = Toast.useToastManager()
    const images = useRef<Map<number, Array<HTMLImageElement | undefined>>>(new Map());
    const failedImagesSources = useRef<string[]>([])

    useEffect(() => {
        // Reset images when spectrogram or analysis changes
        images.current = new Map();
    }, [ selectedAnalysis, spectrogram ]);

    const areAllImagesLoaded = useCallback((): boolean => {
        return images.current.get(zoom)?.filter(i => !!i).length === zoom
    }, [ zoom ])

    const loadImages = useCallback(async () => {
        let _paths = paths
        if (!_paths) {
            const { data } = await refetch()
            _paths = data
        }
        if (!selectedAnalysis || !_paths?.spectrogramPath || !spectrogram) {
            images.current = new Map();
            return;
        }
        if (areAllImagesLoaded()) return;

        const filename = spectrogram.filename
        return Promise.all(
            Array.from(new Array<HTMLImageElement | undefined>(zoom)).map(async (_, index) => {
                let src = _paths.spectrogramPath;
                if (!src) return;
                if (selectedAnalysis.legacy) {
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
                        toastManager.addError({ title: `Fail loading spectrogram: ${ image.src }`, error })
                        resolve(undefined);
                    }
                })
            }),
        ).then(loadedImages => {
            images.current.set(zoom, loadedImages)
        })
    }, [ selectedAnalysis, zoom, failedImagesSources, areAllImagesLoaded, spectrogram, paths, toastManager, refetch ])

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
