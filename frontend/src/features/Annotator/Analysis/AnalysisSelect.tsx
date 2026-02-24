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
    return [...(allAnalysis ?? [])]
      .sort((a, b) => (a?.fft.nfft ?? 0) - (b?.fft.nfft ?? 0))
      .map(a => {
        const label = `nfft: ${ a!.fft.nfft }`;
        return { value: a!.id, label }
      })
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