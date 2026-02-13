import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { useAudio } from '@/features/Audio';
import { useAppSelector } from '@/features/App';
import { selectZoom } from '@/features/Annotator/Zoom';
import { useSpectrogramDimensions } from '@/features/Spectrogram/Display/dimension.hook';

export const TimeBar: React.FC = () => {
  const audio = useAudio();
  const zoom = useAppSelector(selectZoom)
  const { width } = useSpectrogramDimensions(zoom)

  if (!audio.source || !audio.duration) return <Fragment/>
  return (
    <div className={ styles.timeBar } style={ { left: audio.time * width / audio.duration } }/>
  )
}