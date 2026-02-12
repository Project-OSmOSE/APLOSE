import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { Input, Select } from '@/components/form';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAllAnalysis, selectAnalysis, selectFFT } from './selectors';
import { setAnalysis, setFFT } from './slice';
import { selectSpectrogramMode } from '@/features/Annotator/VisualConfiguration';
import { Button } from '@/components/ui';


export const AnalysisSelect: React.FC = () => {
    const allAnalysis = useAppSelector(selectAllAnalysis)
    const analysis = useAppSelector(selectAnalysis)
    const mode = useAppSelector(selectSpectrogramMode)
    const fft = useAppSelector(selectFFT)
    const dispatch = useAppDispatch()

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
        if (analysis) dispatch(setAnalysis(analysis))
    }, [ allAnalysis, dispatch ])


    const [ nfft, setNfft ] = useState<number | undefined>(fft?.nfft);
    const [ windowSize, setWindowSize ] = useState<number | undefined>(fft?.windowSize);
    const [ overlap, setOverlap ] = useState<number | undefined>(fft?.overlap);

    const updateFFT = useCallback(() => {
        dispatch(setFFT({
            nfft: !nfft || isNaN(nfft) ? undefined : nfft,
            windowSize: !windowSize || isNaN(windowSize) ? undefined : windowSize,
            overlap: !overlap || isNaN(overlap) ? undefined : overlap,
        }))
    }, [ dispatch, nfft, windowSize, overlap ])

    switch (mode) {
        case 'png':
            return <Select placeholder="Select a configuration"
                           options={ options }
                           optionsContainer="popover"
                           value={ analysis?.id }
                           required={ true }
                           onValueSelected={ select }/>
        default:
            return <Fragment>
                <Input type="number" label="nfft" width={24}
                       placeholder={ analysis?.fft.nfft.toString() }
                       value={ nfft }
                       onInput={ e => setNfft(e.currentTarget.valueAsNumber) }/>
                <Input type="number" label="winsize"
                       placeholder={ analysis?.fft.windowSize.toString() }
                       value={ windowSize }
                       onInput={ e => setWindowSize(e.currentTarget.valueAsNumber) }/>
                <Input type="number" label="overlap"
                       placeholder={ analysis?.fft.overlap.toString() }
                       value={ overlap }
                       min={ 0.1 }
                       max={ 0.9 }
                       step={ 0.1 }
                       onInput={ e => setOverlap(e.currentTarget.valueAsNumber) }/>
                <Button onClick={ updateFFT }>Update</Button>
            </Fragment>
    }
}