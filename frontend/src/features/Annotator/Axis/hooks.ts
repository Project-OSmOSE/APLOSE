import { useMemo } from 'react';
import { LinearScaleService, MultiScaleService } from '@/components/ui';
import { useAnnotationTask } from '@/api';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { useAppSelector } from '@/features/App';

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
  const analysis = useAppSelector(selectAnalysis)
  const height = useWindowHeight()

  return useMemo(() => {
    const options = {
      pixelOffset: 0,
      disableValueFloats: true,
      revert: true,
    }
    if (analysis?.legacyConfiguration?.linearFrequencyScale) {
      return new LinearScaleService(
        height,
        analysis.legacyConfiguration.linearFrequencyScale,
        options,
      )
    }
    if (analysis?.legacyConfiguration?.multiLinearFrequencyScale) {
      return new MultiScaleService(
        height,
        analysis.legacyConfiguration.multiLinearFrequencyScale.innerScales?.filter(s => s !== null).map(s => s!) ?? [],
        options,
      )
    }
    return new LinearScaleService(height, {
      maxValue: analysis?.fft.samplingFrequency ?? 0,
      minValue: 0,
      ratio: 1,
    }, options)
  }, [ analysis, height ]);
}
