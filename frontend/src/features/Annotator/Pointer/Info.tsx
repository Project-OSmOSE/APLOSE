import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { formatTime } from '@/service/function';
import { useAnnotationTask } from '@/api';
import { useAppSelector } from '@/features/App';
import { selectPosition } from '@/features/Annotator/Pointer';

export const PointerInfo: React.FC = () => {
  const position = useAppSelector(selectPosition)
  const { spectrogram } = useAnnotationTask()

  if (!position) return <Fragment/>
  return <div className={ styles.pointerInfo }>
    <FadedText>Pointer</FadedText>
    <p>{ position.frequency.toFixed(2) }Hz
      / { formatTime(position.time, (spectrogram?.duration ?? 0) < 60) }</p>
  </div>
}
