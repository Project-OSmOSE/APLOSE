import React from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { formatTime } from '@/service/function';
import { useAnnotationTask } from '@/api';
import { useAppSelector } from '@/features/App';
import { selectPosition } from '@/features/Annotator/Pointer';

export const PointerInfo: React.FC = () => {
  const position = useAppSelector(selectPosition)
  const { spectrogram } = useAnnotationTask()

  return <div className={ [ styles.pointerInfo, position ? '' : styles.hidden ].join(' ') }>
    <FadedText>Pointer</FadedText>
    { position ?
      <p>{ position.frequency.toFixed(2) }Hz
        / { formatTime(position.time, (spectrogram?.duration ?? 0) < 60) }</p> : <p>0</p> }
  </div>
}
