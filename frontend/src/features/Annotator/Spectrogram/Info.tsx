import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { FadedText } from '@/components/ui';
import { useLoaderData } from '@tanstack/react-router';

export const SpectrogramInfo: React.FC = () => {
  const { spectrogram } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })

  if (!spectrogram) return <Fragment/>
  return <div className={ styles.spectrogramInfo }>
    <FadedText>Date:</FadedText>
    <p>{ new Date(spectrogram.start).toUTCString() }</p>
  </div>
}
