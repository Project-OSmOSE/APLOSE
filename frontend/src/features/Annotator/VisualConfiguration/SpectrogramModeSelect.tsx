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
                   options={ ([
                       { value: 'png', label: 'From png' },
                       { value: 'wav', label: 'From wav' },
                       { value: 'npz', label: 'From npz' },
                   ]) }
                   optionsContainer="popover"
                   value={ mode }
                   required={ true }
                   onValueSelected={ set }/>
}