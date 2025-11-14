import React from 'react';
import styles from './styles.module.scss';
import {
  useAnnotatorCanvasContext,
  useWindowHeight,
  useWindowWidth,
  X_AXIS_HEIGHT,
  Y_AXIS_WIDTH,
} from '@/features/Annotator/Canvas';
import { useAxis } from '@/components/ui';
import { formatTime, frequencyToString } from '@/service/function';
import { useFrequencyScale, useTimeScale } from './hooks'

export const TimeAxis: React.FC = () => {
  const timeScale = useTimeScale()
  const width = useWindowWidth()
  const { xAxisCanvasRef } = useAnnotatorCanvasContext()
  useAxis({
    canvas: xAxisCanvasRef?.current,
    pixelSize: width,
    orientation: 'horizontal',
    valueToString: formatTime,
    scale: timeScale,
  })

  return <canvas ref={ xAxisCanvasRef }
                 className={ styles.xAxis }
                 width={ width }
                 height={ X_AXIS_HEIGHT }/>
}

export const FrequencyAxis: React.FC = () => {
  const frequencyScale = useFrequencyScale()
  const height = useWindowHeight()
  const { yAxisCanvasRef } = useAnnotatorCanvasContext()
  useAxis({
    canvas: yAxisCanvasRef?.current,
    pixelSize: height,
    orientation: 'vertical',
    valueToString: frequencyToString,
    scale: frequencyScale,
  })

  return <canvas ref={ yAxisCanvasRef }
                 className={ styles.yAxis }
                 width={ Y_AXIS_WIDTH }
                 height={ height }/>
}
