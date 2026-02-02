import { useMemo } from 'react';
import { LinearScaleService, LogScaleService, MultiScaleService } from '@/components/ui';
import { useAnnotationTask } from '@/api';
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { useWindowHeight, useWindowWidth } from '@/features/Annotator/Canvas';
import { useAppSelector } from '@/features/App';
import { selectFrequencyScaleType } from '@/features/Annotator/VisualConfiguration';

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
  const frequencyScaleType = useAppSelector(selectFrequencyScaleType)

  return useMemo(() => {
    const linearOptions = {
      pixelOffset: 0,
      disableValueFloats: true,
      revert: true,
    }
    const logOptions = {
      pixelOffset: 0,
      revert: true,
    }

    const maxFreq = (analysis?.fft.samplingFrequency ?? 0) / 2;
    const minFreq = analysis?.legacyConfiguration?.linearFrequencyScale?.minValue ?? 0;

    // If log scale is selected, use LogScaleService
    if (frequencyScaleType === 'log') {
      return new LogScaleService(height, {
        maxValue: maxFreq,
        minValue: Math.max(minFreq, 1), // Log scale needs positive min value
      }, logOptions)
    }

    // Otherwise use linear or multi-linear based on analysis config
    if (analysis?.legacyConfiguration?.linearFrequencyScale) {
      return new LinearScaleService(
        height,
        analysis.legacyConfiguration.linearFrequencyScale,
        linearOptions,
      )
    }
    if (analysis?.legacyConfiguration?.multiLinearFrequencyScale) {
      return new MultiScaleService(
        height,
        analysis.legacyConfiguration.multiLinearFrequencyScale.innerScales?.filter(s => s !== null).map(s => s!) ?? [],
        linearOptions,
      )
    }
    return new LinearScaleService(height, {
      maxValue: maxFreq,
      minValue: minFreq,
      ratio: 1,
    }, linearOptions)
  }, [ analysis, height, frequencyScaleType ]);
}
