import React, { Fragment } from "react";
import styles from "../styles.module.scss";
import { useAnnotatorAudio, useAnnotatorQuery, useSpectrogram } from "@/features/Annotator";

export const TimeBar: React.FC = () => {
  const { data } = useAnnotatorQuery()
  const { time } = useAnnotatorAudio()
  const { width } = useSpectrogram()

  if (!data?.spectrogramById) return <Fragment/>
  return (
    <div className={ styles.timeBar } style={ { left: time * width / data.spectrogramById.duration } }/>
  )
}