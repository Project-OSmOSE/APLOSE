import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { Select } from "@/components/form";
import { useAnnotatorInput } from "@/features/Annotator";

export const NFFTSelect: React.FC = () => {
  const { analysisID, analysis, allAnalysis, setAnalysisID } = useAnnotatorInput();

  useEffect(() => {
    if (!analysisID || analysis || allAnalysis.length === 0) return;
    const baseScaleAnalysis = allAnalysis.find(a => !a.legacyConfiguration?.scaleName);
    const minID = Math.min(...allAnalysis.map(a => +a.pk))?.toString();
    if (minID) setAnalysisID(baseScaleAnalysis?.pk ?? minID)
  }, [ analysisID, allAnalysis, analysis, setAnalysisID ]);

  const options = useMemo(() => {
    return allAnalysis.map(a => {
      let label = `nfft: ${ a.fft.nfft }`;
      label += ` | winsize: ${ a.fft.windowSize }`
      label += ` | overlap: ${ a.fft.overlap }`
      label += ` | scale: ${ a.legacyConfiguration?.scaleName ?? 'Default' }`
      return { value: a.pk, label }
    })
  }, [ allAnalysis ]);

  const select = useCallback((value: string | number | undefined) => {
    if (value === undefined) return;
    const analysis = allAnalysis.find(a => a.pk === (typeof value === 'number' ? value.toString() : value))
    if (analysis) setAnalysisID(analysis.pk)
  }, [ allAnalysis, setAnalysisID ])

  if (!allAnalysis.length) return <Fragment/>
  return <Select placeholder='Select a configuration'
                 options={ options }
                 optionsContainer='popover'
                 value={ analysisID }
                 required={ true }
                 onValueSelected={ select }/>
}