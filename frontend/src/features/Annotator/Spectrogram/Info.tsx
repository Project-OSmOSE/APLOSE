import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { useAnnotationTask } from '@/api';

export const SpectrogramInfo: React.FC = () => {
  const { spectrogram } = useAnnotationTask()

  if (!spectrogram) return <Fragment/>
  return <div className={ styles.spectrogramInfo }>
    <FadedText>Date:</FadedText>
    <p>{ new Date(spectrogram.start).toUTCString() }</p>
  </div>
}
