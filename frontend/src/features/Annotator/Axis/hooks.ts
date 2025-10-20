import { useMemo } from 'react';
import { LinearScaleService, MultiScaleService } from '@/components/ui';
import { useAnnotationTask } from '@/api';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis';
import { useAnnotatorWindow } from '@/features/Annotator/Canvas';

export const useTimeAxis = () => {
  const { task } = useAnnotationTask()
  const { width } = useAnnotatorWindow()
  const scale = useMemo(() => new LinearScaleService(
    width,
    {
      ratio: 1,
      minValue: 0,
      maxValue: task?.spectrogram.duration ?? 0,
    },
  ), [ task, width ])

  return {
    timeScale: scale,
  }
}

export const useFrequencyAxis = () => {
  const { analysis } = useAnnotatorAnalysis()
  const { height } = useAnnotatorWindow()
  const scale = useMemo(() => {
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

  return {
    frequencyScale: scale,
  }
}
