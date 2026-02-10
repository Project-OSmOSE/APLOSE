import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { AnnotationSpectrogramNode, SpectrogramAnalysisNode } from '@/api';
import { useSpectrogramDimensions } from './dimension.hook.ts';
import type { FFT, SpectrogramMode } from './types';
import { TileManager, type TileManagerOptions } from '@/features/Spectrogram/Display/TileManager';

export const SpectrogramDisplay: React.FC<{
    zoomLevel: number,
    left: number,
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'path'>,
    analysis: Pick<SpectrogramAnalysisNode, 'id' | 'legacy'> & { fft: FFT },
    mode: SpectrogramMode,
    fft?: FFT,
}> = ({ zoomLevel, spectrogram, analysis, mode, fft, left }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { width, height } = useSpectrogramDimensions(zoomLevel)

    const tileManager = useRef<TileManager>();
    const options = useMemo<TileManagerOptions>(() => ({
        spectrogram, analysis, mode, fft: { ...analysis.fft, ...(fft ?? {}) },
    }), [ analysis, spectrogram, mode, fft ])

    const setNewTileManager = useCallback(() => {
        if (!canvasRef.current) return;
        tileManager.current = TileManager.getManager(
            canvasRef.current,
            options,
            zoomLevel,
            left
        )
    }, [ options, zoomLevel, left ])

    useEffect(() => { // On page load
        setNewTileManager()
    }, [])
    useEffect(() => { // On options changed
        setNewTileManager()
    }, [ options ])
    useEffect(() => { // On zoomLevel changed
        if (tileManager.current) tileManager.current.zoom = zoomLevel;
    }, [ zoomLevel ])
    useEffect(() => { // On left changed
        if (tileManager.current) tileManager.current.left = left;
    }, [ left ])

    return <canvas id="spectrogram" // id used by SpectrogramDownloadButton
                   ref={ canvasRef }
                   height={ height }
                   width={ width }
                   style={ { display: 'block' } }/>
}
