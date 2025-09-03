import { useCallback, useMemo } from 'react';
import { AbstractScale, LinearScaleService, MultiLinearScaleService } from './scales';
import { useSpectrogram } from "./spectrogram.hook";
import { useAnnotatorInput } from "./input.hook";
import { useAnnotatorQuery } from "./query.hook";

export const useXAxis = (): AbstractScale => {
  const { width } = useSpectrogram()
  const { data } = useAnnotatorQuery()
  return useMemo(() => new LinearScaleService(width, { maxValue: data?.spectrogramById?.duration ?? 0 }), [ width, data?.spectrogramById ])
}

export const useYAxis = (): AbstractScale => {
  const { analysis } = useAnnotatorInput()
  const { height } = useSpectrogram()
  const scale = useMemo(() => {
    if (analysis?.legacyConfiguration?.linearFrequencyScale) {
      return new LinearScaleService(
        height,
        analysis.legacyConfiguration.linearFrequencyScale
      )
    }
    if (analysis?.legacyConfiguration?.multiLinearFrequencyScale) {
      return new MultiLinearScaleService(
        height,
        analysis.legacyConfiguration.multiLinearFrequencyScale.innerScales?.results.filter(s => s !== null) ?? []
      )
    }
    return new LinearScaleService(height, { maxValue: analysis?.fft.samplingFrequency ?? 0 })
  }, [ analysis, height ]);

  const valueToPosition = useCallback((value: number) => {
    let position = height - scale.valueToPosition(value);
    if (position > height) position = height
    if (position < 0) position = 0
    return position
  }, [ scale ])

  const positionToValue = useCallback((position: number) => {
    if (position < 0) position = 0
    return Math.floor(scale.positionToValue(height - position));
  }, [ scale ])

  const valuesToPositionRange = useCallback((min: number, max: number) => {
    return Math.abs(valueToPosition(max) - valueToPosition(min));
  }, [ scale ])

  const positionsToRange = useCallback((min: number, max: number) => {
    return Math.abs(positionToValue(max) - positionToValue(min));
  }, [ scale ])

  const isRangeContinuouslyOnScale = useCallback(scale.isRangeContinuouslyOnScale.bind(scale), [ scale ])
  const getSteps = useCallback(scale.getSteps.bind(scale), [ scale ])

  return useMemo(() => ({
    valueToPosition,
    valuesToPositionRange,
    positionToValue,
    positionsToRange,
    isRangeContinuouslyOnScale,
    getSteps
  }), [ scale ])
}

export const useAxis = () => {
  return {
    xAxis: useXAxis(),
    yAxis: useYAxis()
  }
}