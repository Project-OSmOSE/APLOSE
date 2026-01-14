import React, { useCallback, useMemo } from 'react';
import { Select } from '@/components/form';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAllAnalysis, selectAnalysis } from './selectors';
import { Analysis, setAnalysis } from './slice';


export const AnalysisSelect: React.FC = () => {
  const allAnalysis = useAppSelector(selectAllAnalysis)
  const analysis = useAppSelector(selectAnalysis)
  const dispatch = useAppDispatch()

  const set = useCallback((value?: Analysis) => {
    dispatch(setAnalysis(value))
  }, [ dispatch ])

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
    if (analysis) set(analysis)
  }, [ allAnalysis, set ])

  return <Select placeholder="Select a configuration"
                 options={ options }
                 optionsContainer="popover"
                 value={ analysis?.id }
                 required={ true }
                 onValueSelected={ select }/>
}