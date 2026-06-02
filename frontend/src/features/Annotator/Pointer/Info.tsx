import React from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { formatTime } from '@/service/function';
import { usePointer } from '@/features/Annotator/Pointer';
import { useLoaderData } from '@tanstack/react-router';

export const PointerInfo: React.FC = () => {
  const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
  const pointer = usePointer()

  return <div className={ [ styles.pointerInfo, pointer.position ? '' : styles.hidden ].join(' ') }>
    <FadedText>Pointer</FadedText>
    { pointer.position ?
      <p>{ pointer.position.frequency.toFixed(2) }Hz
        / { formatTime(pointer.position.time, (spectrogram?.duration ?? 0) < 60) }</p> : <p>0</p> }
  </div>
}
