import { useMemo } from 'react';
import { LinearScaleService, MultiScaleService } from '@/components/ui';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useLoaderData } from '@tanstack/react-router';

export const useTimeScale = () => {
    const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
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
    const { selectedAnalysis } = useAnnotatorAnalysis()
    const height = useWindowHeight()

    return useMemo(() => {
        const options = {
            pixelOffset: 0,
            disableValueFloats: true,
            revert: true,
        }
        if (selectedAnalysis?.frequencyScaleParts && selectedAnalysis?.frequencyScaleParts.length) {
            return new MultiScaleService(
                height,
                selectedAnalysis.frequencyScaleParts?.filter(s => s !== null).map(s => s!) ?? [],
                options,
            )
        }
        return new LinearScaleService(height, {
            maxValue: (selectedAnalysis?.fft.samplingFrequency ?? 0) / 2,
            minValue: 0,
            ratio: 1,
        }, options)
    }, [ selectedAnalysis, height ]);
}
