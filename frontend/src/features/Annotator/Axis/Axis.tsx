import React, { useEffect } from 'react';
import styles from './styles.module.scss';
import { useAnnotatorCanvas, useAnnotatorWindow } from '@/features/Annotator/Canvas';
import { useAxis } from '@/components/ui';
import { formatTime, frequencyToString } from '@/service/function';
import { useFrequencyAxis, useTimeAxis } from './hooks'

export const TimeAxis: React.FC = () => {
  const { timeScale } = useTimeAxis()
  const { width, xAxisHeight } = useAnnotatorWindow()
  const { xAxisCanvas, setXAxisCanvas } = useAnnotatorCanvas()
  const { draw } = useAxis({
    canvas: xAxisCanvas,
    pixelSize: width,
    orientation: 'horizontal',
    valueToString: formatTime,
    scale: timeScale,
  })

  useEffect(() => {
    draw()
  }, [ xAxisCanvas, width, timeScale ]);

  return <canvas ref={ ref => !!ref && setXAxisCanvas(ref) }
                 className={ styles.xAxi }
                 width={ width }
                 height={ xAxisHeight }/>
}

export const FrequencyAxis: React.FC = () => {
  const { frequencyScale } = useFrequencyAxis()
  const { height, yAxisWidth } = useAnnotatorWindow()
  const { yAxisCanvas, setYAxisCanvas } = useAnnotatorCanvas()
  const { draw } = useAxis({
    canvas: yAxisCanvas,
    pixelSize: height,
    orientation: 'vertical',
    valueToString: frequencyToString,
    scale: frequencyScale,
  })

  useEffect(() => {
    draw()
  }, [ yAxisCanvas, height, frequencyScale ]);

  return <canvas ref={ ref => !!ref && setYAxisCanvas(ref) }
                 className={ styles.yAxis }
                 width={ yAxisWidth }
                 height={ height }/>
}
