import { useMemo } from 'react';
import { LinearScaleService, MultiScaleService } from '@/components/ui';
import { useAnnotationTask } from '@/api';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis/hooks';

export const useTimeScale = () => {
    const { spectrogram } = useAnnotationTask()
    const width = useWindowWidth()

    return useMemo(() => new LinearScaleService(
        width,
        {
            ratio: 1,
            minValue: 0,
            maxValue: spectrogram?.duration ?? 0,
        },
    ), [ spectrogram, width ])
}

export const useFrequencyScale = () => {
    const analysis = useAnnotatorAnalysis()
    const height = useWindowHeight()

    return useMemo(() => {
        const options = {
            pixelOffset: 0,
            disableValueFloats: true,
            revert: true,
        }
        if (analysis?.frequencyScaleParts && analysis?.frequencyScaleParts.length) {
            return new MultiScaleService(
                height,
                analysis.frequencyScaleParts?.filter(s => s !== null).map(s => s!) ?? [],
                options,
            )
        }
        return new LinearScaleService(height, {
            maxValue: (analysis?.fft.samplingFrequency ?? 0) / 2,
            minValue: 0,
            ratio: 1,
        }, options)
    }, [ analysis, height ]);
}
