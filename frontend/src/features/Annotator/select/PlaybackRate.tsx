import React, { Fragment, MutableRefObject, useCallback } from "react";
import { Select } from "@/components/form";
import { useAnnotatorInput } from "@/features/Annotator";

const AVAILABLE_RATES: Array<number> = [ 0.25, 0.5, 1.0, 1.5, 2.0, 3.0, 4.0 ];


export const PlaybackRateSelect: React.FC<{ player: MutableRefObject<HTMLAudioElement | null> }> = ({ player }) => {
  const { audioSpeed, setAudioSpeed: _setAudioSpeed } = useAnnotatorInput()

  const setAudioSpeed = useCallback((value: string | number | undefined) => {
    const rate = +(value ?? 1.0);
    if (player?.current) player.current.playbackRate = rate;
    _setAudioSpeed(rate)
  }, [ player, _setAudioSpeed ])

  if (!player || player.current?.preservesPitch === undefined) return <Fragment/>
  return <Select placeholder='Select playback rate'
                 options={ AVAILABLE_RATES.map(r => ({
                   value: r,
                   label: `${ r.toString() }x`
                 })) }
                 value={ audioSpeed }
                 required={ true }
                 optionsContainer='popover'
                 onValueSelected={ setAudioSpeed }/>
}