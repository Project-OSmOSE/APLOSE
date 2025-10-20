import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { useAnnotationTask } from '@/api';

export const SpectrogramInfo: React.FC = () => {
  const { task } = useAnnotationTask()
  
  if (!task) return <Fragment/>
  return <div className={ styles.spectrogramInfo }>
    <FadedText>Date:</FadedText>
    <p>{ new Date(task.spectrogram.start).toUTCString() }</p>
  </div>
}
