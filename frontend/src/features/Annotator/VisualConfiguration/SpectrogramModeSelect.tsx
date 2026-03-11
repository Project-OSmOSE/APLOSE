import React, { useCallback } from 'react';
import { Select } from '@/components/form';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectSpectrogramMode } from './selectors';
import type { SpectrogramMode } from '@/features/Spectrogram/Display';
import { setSpectrogramMode } from '@/features/Annotator/VisualConfiguration/slice';


export const SpectrogramModeSelect: React.FC = () => {
    const mode = useAppSelector(selectSpectrogramMode);
    const dispatch = useAppDispatch()

    const set = useCallback((mode?: string | number) => {
        dispatch(setSpectrogramMode(mode as SpectrogramMode))
    }, [ dispatch ])

    return <Select placeholder="Select spectrogram generation mode"
                   stick='left'
                   options={ ([
                       { value: 'png' as SpectrogramMode, label: 'From png' },
                       { value: 'png-numeric-zoom' as SpectrogramMode, label: 'From png using numeric zoom' },
                       { value: 'npz' as SpectrogramMode, label: 'From npz' },
                       { value: 'wav' as SpectrogramMode, label: 'From wav' },
                   ]) }
                   optionsContainer="popover"
                   value={ mode }
                   required={ true }
                   onValueSelected={ set }/>
}