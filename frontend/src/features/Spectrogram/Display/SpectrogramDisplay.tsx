import React, { useCallback, useRef } from 'react';
import { useSpectrogramDimensions } from '@/features/Spectrogram/Display/dimension.hook.ts';
import { useSpectrogramTiles } from '@/features/Spectrogram/Display/draw.hook.ts';
import { AnnotationSpectrogramNode, SpectrogramAnalysisNode } from '@/api';

export const SpectrogramDisplay: React.FC<{
    zoomLevel: number,
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'path'>,
    analysis: Pick<SpectrogramAnalysisNode, 'id' | 'legacy'>
}> = ({ zoomLevel, spectrogram, analysis }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const { width, height } = useSpectrogramDimensions(0)

    const getUrl = useCallback((_: number, index: number) => {
        if (analysis.legacy) {
            const p = spectrogram.path
            const f = spectrogram.filename
            return `${ p.split(f)[0] }${ f }_${ zoomLevel }_${ index }${ p.split(f)[1] }`
        } else return spectrogram.path
    }, [ spectrogram, zoomLevel, analysis ])

    useSpectrogramTiles({ canvasRef, zoomLevel: zoomLevel.toString(2).length - 1, getUrl })

    return <canvas id="spectrogram" // id used by SpectrogramDownloadButton
                   ref={ canvasRef }
                   height={ height }
                   width={ width * (zoomLevel) }
                   style={ { display: 'block' } }/>
}
