import { useMemo } from 'react';
import { LinearScaleService, LogScaleService, MultiScaleService } from '@/components/ui';
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
    const logOptions = {
      pixelOffset: 0,
      revert: true,
    }

    const maxFreq = (analysis?.fft.samplingFrequency ?? 0) / 2;
    const minFreq = analysis?.legacyConfiguration?.linearFrequencyScale?.minValue ?? 0;

    // Always use logarithmic frequency scale for better audio visualization
    return new LogScaleService(height, {
      maxValue: maxFreq,
      minValue: Math.max(minFreq, 1), // Log scale needs positive min value
    }, logOptions)
  }, [ analysis, height ]);
}
