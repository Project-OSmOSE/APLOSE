import React, { Fragment, useCallback } from 'react';
import { Select } from '@/components/base';
import { useAudio } from './context';

const AVAILABLE_RATES: Array<number> = [ 0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0 ];

export const PlaybackRateSelect: React.FC = () => {
    const audio = useAudio()

    const setAudioSpeed = useCallback((value: number | null) => {
        const rate = +(value ?? 1.0);
        audio.setPlaybackRate(rate)
    }, [ audio ])

    if (!audio.source) return <Fragment/>
    return <Select items={ AVAILABLE_RATES }
                   defaultValue={ 1 }
                   required
                   itemName="playback rate"
                   value={ audio.playbackRate }
                   onValueChange={ setAudioSpeed }
                   itemToStringValue={ item => `${ item?.toString() }x` }
                   itemToElementLabel={ item => `${ item?.toString() }x` }/>
}