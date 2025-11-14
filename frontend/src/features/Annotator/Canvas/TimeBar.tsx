import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { useAudio } from '@/features/Audio';
import { useWindowWidth } from './window.hooks';

export const TimeBar: React.FC = () => {
  const audio = useAudio();
  const width = useWindowWidth()

  if (!audio.source) return <Fragment/>
  return (
    <div className={ styles.timeBar } style={ { left: audio.time * width / (audio.duration ?? 1) } }/>
  )
}