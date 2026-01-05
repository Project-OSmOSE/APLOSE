import React, { Fragment, useCallback, useMemo } from 'react';
import { Select } from '@/components/form';
import { useAudio } from './context';

const AVAILABLE_RATES: Array<number> = [ 0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0 ];

export const PlaybackRateSelect: React.FC = () => {
  const audio = useAudio()
  const options = useMemo(() => AVAILABLE_RATES.map(r => ({
    value: r,
    label: `${ r.toString() }x`,
  })), [ AVAILABLE_RATES ])

  const setAudioSpeed = useCallback((value: string | number | undefined) => {
    const rate = +(value ?? 1.0);
    audio.setPlaybackRate(rate)
  }, [ audio.setPlaybackRate ])

  if (!audio.source) return <Fragment/>
  return <Select placeholder="Select playback rate"
                 options={ options }
                 value={ audio.playbackRate }
                 required={ true }
                 optionsContainer="popover"
                 onValueSelected={ setAudioSpeed }/>
}