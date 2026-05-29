import React, { useCallback, useMemo } from 'react';
import { Select } from '@/components/form';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAllAnalysis, selectAnalysis } from './selectors';
import { Analysis, setAnalysis } from './slice';
import { frequencyToString } from '@/service/function';


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
            const parts = a?.frequencyScaleParts ?? []
            const defaultMax = a!.fft.samplingFrequency / 2
            let min = 0
            let max = defaultMax
            if (parts.length) {
                min = Math.min(...parts.map(a => a?.minValue ?? 0))
                max = Math.max(...parts.map(a => a?.maxValue ?? defaultMax))
            }
            const range = `[${ frequencyToString(min) }Hz-${ frequencyToString(max) }Hz]`
            label += ` | scale: ${ parts.length > 0 ? parts.length : 1 } ${ range }`
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