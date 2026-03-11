import React, { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectZoomMode } from './selectors';
import type { ZoomMode } from '@/features/Spectrogram/Display';
import { setZoomMode } from './slice';
import { Select } from '@/components/form';

export const ZoomModeSelect: React.FC = () => {
    const mode = useAppSelector(selectZoomMode);
    const dispatch = useAppDispatch()

    const set = useCallback((mode?: string | number) => {
        dispatch(setZoomMode(mode as ZoomMode))
    }, [ dispatch ])

    return <Select placeholder="Select zoom mode"
                   stick="left"
                   options={ ([
                       { value: 'processed' as ZoomMode, label: 'Processed' },
                       { value: 'numeric' as ZoomMode, label: 'Numeric' },
                   ]) }
                   optionsContainer="popover"
                   value={ mode }
                   required={ true }
                   onValueSelected={ set }/>
}
