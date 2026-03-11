import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { AnnotationSpectrogramNode, SpectrogramAnalysisNode, useLazyGetTile } from '@/api';
import type { FFT, SpectrogramMode, ZoomMode } from '@/features/Spectrogram/Display/types';
import { useSpectrogramDimensions } from '@/features/Spectrogram/Display/dimension.hook';
import type { QueryActionCreatorResult } from '@reduxjs/toolkit/query';
import { useToast } from '@/components/ui';

export type TileManagerOptions = {
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename'>,
    spectrogramPath?: string | null,
    analysis: Pick<SpectrogramAnalysisNode, 'id' | 'legacy'>,
    mode: SpectrogramMode,
    zoomMode: ZoomMode,
    fft?: Partial<FFT>,
}

type TileManagerParams = {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    options: TileManagerOptions,
    zoom: number,
    left: number,
}
const PRELOAD_MARGIN = 1;

export const useTileManager = ({ canvasRef, options, zoom: _zoom, left: _left }: TileManagerParams) => {
    const queriesRef = useRef<QueryActionCreatorResult<any>[]>([]);
    const toast = useToast()

    const tileDimensions = useSpectrogramDimensions(0)

    const loadingTileIndexesRef = useRef<number[]>([])
    const loadedTileIndexesRef = useRef<number[]>([])

    const modeRef = useRef<SpectrogramMode>('png')
    const analysisRef = useRef<Pick<SpectrogramAnalysisNode, 'id' | 'legacy'> | undefined>()
    const spectrogramRef = useRef<Pick<AnnotationSpectrogramNode, 'id' | 'filename'> | undefined>()
    const pathRef = useRef<string | undefined>()
    const fftRef = useRef<Partial<FFT> | undefined>()

    const zoomRef = useRef<number>(0)
    const zoomModeRef = useRef<ZoomMode>('processed')
    const leftRef = useRef<number>(0)

    const [ getTile ] = useLazyGetTile()

    const clearCanvas = useCallback((): void => {
        const context = canvasRef.current?.getContext('2d', { alpha: false });
        if (!context || !canvasRef.current) return;
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }, [ canvasRef ])

    const displayTile = useCallback(async (objectURL: string, index: number): Promise<void> => {
        const context = canvasRef.current?.getContext('2d', { alpha: false });
        if (!context) return;
        const image = new Image();
        const loadPromise = new Promise((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = reject;
        });
        image.src = objectURL;
        await loadPromise;
        switch (zoomModeRef.current) {
            case 'numeric':
                context.drawImage(
                    image,
                    0,
                    0,
                    tileDimensions.width * Math.pow(2, zoomRef.current),
                    tileDimensions.height,
                )
                break
            case 'processed':
                context.drawImage(
                    image,
                    index * tileDimensions.width,
                    0,
                    tileDimensions.width,
                    tileDimensions.height,
                )
                break
        }
    }, [ canvasRef, tileDimensions , zoomModeRef])
    const fetchTileObjectURL = useCallback(async (index: number): Promise<string> => {
        if (!analysisRef.current) throw Error('Missing analysis');
        if (!spectrogramRef.current) throw Error('Missing spectrogram');
        if (!pathRef.current) throw Error('Missing spectrogram path');
        const query = getTile({
            mode: modeRef.current,
            tile: index,
            zoom: zoomModeRef.current == 'numeric' ? 1 : Math.pow(2, zoomRef.current),
            spectrogramPath: pathRef.current,
            spectrogram: spectrogramRef.current,
            analysis: analysisRef.current,
        });
        if (typeof query === 'string') {
            loadedTileIndexesRef.current.push(index)
            return query
        } else {
            queriesRef.current.push(query);
            const source = await query.unwrap()
            loadedTileIndexesRef.current.push(index)
            return source
        }
    }, [ modeRef, analysisRef, spectrogramRef, getTile, zoomRef, fftRef, loadedTileIndexesRef, zoomModeRef ])
    const loadTile = useCallback(async (index: number): Promise<void> => {
        if (loadedTileIndexesRef.current.some(i => i === index)) return;
        const tilesCount = zoomModeRef.current == 'numeric' ? 1 : Math.pow(2, zoomRef.current)
        if (index < 0 || index >= tilesCount) return;
        try {
            const objectURL = await fetchTileObjectURL(index)
            displayTile(objectURL, index)
            loadedTileIndexesRef.current.push(index)
        } catch (error) {
            if (!('message' in (error as any)) || (error as any).message !== 'Aborted') {
                toast.raiseError({ error })
            }
        }
    }, [ zoomRef, loadedTileIndexesRef, fetchTileObjectURL, displayTile, toast, zoomModeRef ])
    const update = useCallback(async (): Promise<void> => {
        const tilesCount = zoomModeRef.current == 'numeric' ? 1 : Math.pow(2, zoomRef.current)

        const startTileIdx = Math.floor(leftRef.current / tileDimensions.width);
        const endTileIdx = Math.ceil((leftRef.current + tileDimensions.width) / tileDimensions.width);

        const visible = Array.from(
            { length: endTileIdx - startTileIdx + 1 },
            (_, i) => Math.min(startTileIdx + i, tilesCount - 1),
        );

        const min = Math.min(...visible);
        const max = Math.max(...visible);
        const preloaded = [
            Math.max(0, min - PRELOAD_MARGIN),
            Math.min(tilesCount - 1, max + PRELOAD_MARGIN),
        ].filter(index => !visible.includes(index))

        const newTiles = [ ...visible, ...preloaded ].filter(index => !loadedTileIndexesRef.current.includes(index) && !loadingTileIndexesRef.current.includes(index));
        loadingTileIndexesRef.current = [ ...new Set([ ...loadingTileIndexesRef.current, ...newTiles ]) ];
        for (const index of newTiles) {
            await loadTile(index)
        }
    }, [ leftRef, zoomRef, tileDimensions, loadedTileIndexesRef, loadingTileIndexesRef, loadTile, zoomModeRef ])

    // Check either the manager need to be reinitiated
    const init = useCallback(() => {
        queriesRef.current.forEach(q => q.abort())
        queriesRef.current = [];
        loadingTileIndexesRef.current = [];
        loadedTileIndexesRef.current = [];
        clearCanvas()
        update()
    }, [ queriesRef, loadingTileIndexesRef, loadedTileIndexesRef, update, clearCanvas ])
    useEffect(() => {
        let needInit = false;
        if (options.mode !== modeRef.current) {
            needInit = true
            modeRef.current = options.mode
        }
        if (options.zoomMode !== zoomModeRef.current) {
            needInit = true
            zoomModeRef.current = options.zoomMode
        }
        if (options.analysis.id !== analysisRef.current?.id) {
            needInit = true
            analysisRef.current = options.analysis
        }
        if (options.spectrogram.id !== spectrogramRef.current?.id) {
            needInit = true
            spectrogramRef.current = options.spectrogram
        }
        if (options.spectrogramPath && options.spectrogramPath !== pathRef.current) {
            needInit = true
            pathRef.current = options.spectrogramPath
        }
        if (options.fft?.nfft !== fftRef.current?.nfft
            || options.fft?.windowSize !== fftRef.current?.windowSize
            || options.fft?.overlap !== fftRef.current?.overlap) {
            needInit = true
            fftRef.current = options.fft
        }

        if (needInit) init()
    }, [ canvasRef, options ]);

    // On zoom updated
    useEffect(() => {
        if (zoomRef.current === _zoom) return;
        queriesRef.current.forEach(q => q.abort())
        queriesRef.current = [];
        loadingTileIndexesRef.current = []
        loadedTileIndexesRef.current = []
        zoomRef.current = Math.max(0, _zoom)
        clearCanvas()
        update()
    }, [ _zoom ]);

    // On left updated
    useEffect(() => {
        if (leftRef.current === _left || !canvasRef.current) return;
        leftRef.current = Math.min(Math.max(0, _left), canvasRef.current.width);
        update()
    }, [ _left ]);
}
