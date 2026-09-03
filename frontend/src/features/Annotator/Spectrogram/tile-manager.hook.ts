import { type MutableRefObject, useCallback, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnnotationSpectrogramAPI, type GetAnnotationSpectrogramQuery } from '@/features/AnnotationSpectrogram';
import type { CampaignAnalysisFragment } from '@/features/AnnotationCampaign';
import { useWindowContainerWidth, useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { Zoom } from '../Zoom';
import { ImageSettings } from '../ImageSettings';

type TileManagerParams = {
    canvasRef: MutableRefObject<HTMLCanvasElement | null>,
    analysis: CampaignAnalysisFragment | null,
    spectrogram: GetAnnotationSpectrogramQuery['annotationSpectrogramById'],
    left: number,
}
const PRELOAD_MARGIN = 1;

export const useTileManager = ({ canvasRef, analysis, spectrogram, left: _left }: TileManagerParams) => {
    const { data: paths } = useQuery({
        ...AnnotationSpectrogramAPI.getPathQuery({
            spectrogramID: spectrogram?.id ?? '',
            analysisID: analysis?.id ?? '',
        }),
        enabled: !!analysis && !!spectrogram,
    });
    const {
        zoomLevel,
        zoomType,
        maxPreProcessedZoomLevel,
    } = Zoom.useContext()
    const {
        colormap,
        isColormapInverted,
        canvasFilter,
        applyColormap,
    } = ImageSettings.useContext()
    const _tileWidth = useWindowWidth()
    const getZoomLevelToLoad = useCallback((baseLevel: number) => {
        if (zoomType === 'preprocessed') return baseLevel
        else return maxPreProcessedZoomLevel
    }, [ maxPreProcessedZoomLevel, zoomType ])
    const tileHeight = useWindowHeight()

    const loadingTileIndexesRef = useRef<number[]>([])
    const loadedTileIndexesRef = useRef<number[]>([])

    const analysisRef = useRef<CampaignAnalysisFragment | null>(null)
    const spectrogramRef = useRef<GetAnnotationSpectrogramQuery['annotationSpectrogramById']>(null)
    const spectrogramPathRef = useRef<string | null | undefined>()

    const zoomRef = useRef<number>(0)
    const leftRef = useRef<number>(0)

    const clearCanvas = useCallback((): void => {
        const context = canvasRef.current?.getContext('2d', { alpha: false });
        if (!context || !canvasRef.current) return;
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }, [ canvasRef ])

    const setCanvasFilter = useCallback(() => {
        const context = canvasRef.current?.getContext('2d', { alpha: false });
        if (!context) return;
        context.filter = canvasFilter
    }, [ canvasRef, canvasFilter ])
    const setColormap = useCallback(() => {
        const context = canvasRef.current?.getContext('2d', { alpha: false });
        if (!context) return;
        applyColormap(context)
    }, [ canvasRef, applyColormap ])

    const displayTile = useCallback(async (url: string, index: number): Promise<void> => {
        const context = canvasRef.current?.getContext('2d', { alpha: false });
        if (!context) return;
        const image = new Image();
        const loadPromise = new Promise((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = () => reject(`Could not resolve url: ${ url } [${ index }]`);
        });
        image.src = url;
        await loadPromise;
        const tileWidth = zoomType === 'preprocessed' ? _tileWidth : (_tileWidth * (zoomLevel / maxPreProcessedZoomLevel))
        context.drawImage(
            image,
            index * tileWidth,
            0,
            tileWidth,
            tileHeight,
        )
    }, [ canvasRef, _tileWidth, tileHeight, zoomLevel, maxPreProcessedZoomLevel, zoomType ])
    const getTileURL = useCallback((index: number): string => {
        if (!analysisRef.current) throw Error('Missing analysis');
        if (!spectrogramRef.current) throw Error('Missing spectrogram');
        if (!spectrogramPathRef.current) throw Error('Missing spectrogram path');
        const src = spectrogramPathRef.current;
        const filename = spectrogramRef.current.filename
        if (analysisRef.current.legacy) {
            return `${ src.split(filename)[0] }${ filename }_${ getZoomLevelToLoad(zoomRef.current) }_${ index }${ src.split(filename)[1] }`
        }
        return src
    }, [ analysisRef, spectrogramRef, zoomRef, loadedTileIndexesRef, getZoomLevelToLoad ])
    const updateTile = useCallback(async (index: number, options?: { forceRedraw?: boolean }): Promise<void> => {
        if (loadedTileIndexesRef.current.some(i => i === index) && !options?.forceRedraw) return;
        const tilesCount = getZoomLevelToLoad(zoomRef.current)
        if (index < 0 || index >= tilesCount) return;
        try {
            const url = getTileURL(index)
            if (!url) return;
            displayTile(url, index)
            loadedTileIndexesRef.current.push(index)
        } catch (error) {
            console.error(`Failed to load tile ${ zoomRef.current }-${ index }:`, error);
            throw error;
        }
    }, [ zoomRef, loadedTileIndexesRef, getTileURL, displayTile, getZoomLevelToLoad ])
    const update = useCallback(async (options?: { forceRedraw?: boolean }): Promise<void> => {
        const tilesCount = zoomRef.current

        const tileWidth = zoomType === 'preprocessed' ? _tileWidth : (_tileWidth * (zoomLevel / maxPreProcessedZoomLevel))
        const startTileIdx = Math.floor(leftRef.current / tileWidth);
        const endTileIdx = Math.ceil((leftRef.current + tileWidth) / tileWidth);

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
        for (const index of loadingTileIndexesRef.current) {
            await updateTile(index, options)
        }

        setCanvasFilter()
        setColormap()
    }, [ leftRef, zoomRef, setCanvasFilter, setColormap, _tileWidth, canvasRef, loadedTileIndexesRef, loadingTileIndexesRef, updateTile, maxPreProcessedZoomLevel, zoomType, zoomLevel ])

    // Check either the manager need to be reinitiated
    const init = useCallback(() => {
        loadingTileIndexesRef.current = [];
        loadedTileIndexesRef.current = [];
        clearCanvas()
        update()
    }, [ loadingTileIndexesRef, loadedTileIndexesRef, update, clearCanvas ])
    useEffect(() => {
        spectrogramPathRef.current = paths?.spectrogramPath
        analysisRef.current = analysis
        spectrogramRef.current = spectrogram
        init()
    }, [ paths ]);

    // On zoom updated
    useEffect(() => {
        if (zoomRef.current === zoomLevel) return;
        loadingTileIndexesRef.current = []
        loadedTileIndexesRef.current = []
        zoomRef.current = Math.max(0, zoomLevel)
        clearCanvas()
        update()
    }, [ zoomLevel ]);

    // On left updated
    useEffect(() => {
        if (leftRef.current === _left || !canvasRef.current) return;
        leftRef.current = Math.min(Math.max(0, _left), canvasRef.current.width);
        update()
    }, [ _left ]);

    const containerWidth = useWindowContainerWidth()
    useEffect(() => {
        update({ forceRedraw: true })
    }, [
        canvasFilter, // brightness or contrast updated
        colormap, isColormapInverted, // colormap updated
        containerWidth, // container size updated
    ]);
}