import React, { useMemo, useRef } from 'react';
import { AnnotationSpectrogramNode, SpectrogramAnalysisNode } from '@/api';
import { useSpectrogramDimensions } from './dimension.hook.ts';
import type { FFT, SpectrogramMode } from './types';
import { useTileManager, type TileManagerOptions } from './tile-manager.hook';

export const SpectrogramDisplay: React.FC<{
    zoom: number,
    left: number,
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'path'>,
    analysis: Pick<SpectrogramAnalysisNode, 'id' | 'legacy'> & { fft: FFT },
    mode: SpectrogramMode,
    fft?: FFT,
}> = ({ zoom, spectrogram, analysis, mode, fft, left }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { width, height } = useSpectrogramDimensions(zoom)

    const options = useMemo<TileManagerOptions>(() => ({
        spectrogram, analysis, mode, fft: { ...analysis.fft, ...(fft ?? {}) },
    }), [ analysis, spectrogram, mode, fft ])

    useTileManager({ canvasRef, options, zoom, left })

    return <canvas id="spectrogram" // id used by SpectrogramDownloadButton
                   ref={ canvasRef }
                   height={ height }
                   width={ width }
                   style={ { display: 'block' } }/>
}
