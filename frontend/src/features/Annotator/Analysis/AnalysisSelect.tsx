import React, { useCallback, useMemo } from "react";
import { Select } from "@/components/form";
import { useAnnotatorAnalysis } from './hooks'


export const AnalysisSelect: React.FC = () => {
  const { allAnalysis, analysis, setAnalysis } = useAnnotatorAnalysis()

  const options = useMemo(() => {
    return allAnalysis?.map(a => {
      let label = `nfft: ${ a!.fft.nfft }`;
      label += ` | winsize: ${ a!.fft.windowSize }`
      label += ` | overlap: ${ a!.fft.overlap }`
      label += ` | scale: ${ a!.legacyConfiguration?.scaleName ?? 'Default' }`
      return { value: a!.id, label }
    }) ?? []
  }, [ allAnalysis ]);

  const select = useCallback((value: string | number | undefined) => {
    if (value === undefined) return;
    const analysis = allAnalysis?.find(a => a?.id === (typeof value === 'number' ? value.toString() : value))
    if (analysis) setAnalysis(analysis)
  }, [ allAnalysis, setAnalysis ])

  return <Select placeholder='Select a configuration'
                 options={ options }
                 optionsContainer='popover'
                 value={ analysis?.id }
                 required={ true }
                 onValueSelected={ select }/>
}