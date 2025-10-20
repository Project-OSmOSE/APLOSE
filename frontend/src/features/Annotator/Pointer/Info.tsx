import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { formatTime } from '@/service/function';
import { useAnnotatorPointer } from './hooks';
import { useAnnotationTask } from '@/api';

export const PointerInfo: React.FC = () => {
  const { position } = useAnnotatorPointer()
  const { task } = useAnnotationTask()

  if (!position) return <Fragment/>
  return <div className={ styles.pointerInfo }>
    <FadedText>Pointer</FadedText>
    <p>{ position.frequency.toFixed(2) }Hz
      / { formatTime(position.time, (task?.spectrogram.duration ?? 0) < 60) }</p>
  </div>
}
