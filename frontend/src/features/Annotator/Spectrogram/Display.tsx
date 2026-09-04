import React from 'react';
import { useTileManager } from './tile-manager.hook';
import type { CampaignAnalysisFragment } from '@/features/AnnotationCampaign';
import type { GetAnnotationSpectrogramQuery } from '@/features/AnnotationSpectrogram';
import { useAnnotatorCanvasContext, useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';

export const SpectrogramDisplay: React.FC<{
    spectrogram: GetAnnotationSpectrogramQuery['annotationSpectrogramById'],
    analysis: CampaignAnalysisFragment | null,
}> = ({ spectrogram, analysis }) => {
    const { displayCanvasRef, left } = useAnnotatorCanvasContext()
    const width = useWindowWidth()
    const height = useWindowHeight()

    useTileManager({ canvasRef: displayCanvasRef!, spectrogram, analysis, left })

    return <canvas id="spectrogram" // id used by SpectrogramDownloadButton
                   ref={ displayCanvasRef }
                   height={ height }
                   width={ width }
                   style={ { display: 'block' } }/>
}