import React, { useMemo } from 'react';
import styles from './styles.module.scss';
import { useAnnotatorCanvasContext, X_AXIS_HEIGHT, Y_AXIS_WIDTH } from '@/features/Annotator/Canvas';
import { useAxis } from '@/components/ui';
import { formatTime, frequencyToString } from '@/service/function';
import { useFrequencyScale, useTimeScale } from './hooks'
import { useAnnotationTask } from '@/api';
import { useSpectrogramDimensions } from '@/features/Spectrogram/Display/dimension.hook';
import { useAppSelector } from '@/features/App';
import { selectZoom } from '@/features/Annotator/Zoom';

export const TimeAxis: React.FC = () => {
  const { spectrogram } = useAnnotationTask()
  const timeScale = useTimeScale()
  const zoom = useAppSelector(selectZoom)
  const { width } = useSpectrogramDimensions(zoom)
  const { xAxisCanvasRef } = useAnnotatorCanvasContext()

  const timeStep = useMemo(() => {
    if (!spectrogram || spectrogram.duration <= 60) return { smallStep: 1, regularStep: 5 }
    else if (spectrogram.duration > 60 && spectrogram.duration <= 120) return { smallStep: 2, regularStep: 5 }
    else if (spectrogram.duration > 120 && spectrogram.duration <= 500) return { smallStep: 4, regularStep: 5 }
    else if (spectrogram.duration > 500 && spectrogram.duration <= 1000) return { smallStep: 10, regularStep: 60 }
    else return { smallStep: 30, regularStep: 120 }
  }, [ spectrogram ])

  const steps = useMemo(() => {
    return timeScale.getSteps(timeStep.regularStep, timeStep.smallStep)
  }, [ timeScale, timeStep ])
  useAxis({
    canvas: xAxisCanvasRef?.current,
    pixelSize: width,
    orientation: 'horizontal',
    valueToString: formatTime,
    steps,
    displaySmallStepValue: false,
  })

  return <canvas ref={ xAxisCanvasRef }
                 className={ styles.xAxis }
                 width={ width }
                 height={ X_AXIS_HEIGHT }/>
}

export const FrequencyAxis: React.FC = () => {
  const frequencyScale = useFrequencyScale()
  const zoom = useAppSelector(selectZoom)
  const { height } = useSpectrogramDimensions(zoom)
  const { yAxisCanvasRef } = useAnnotatorCanvasContext()
  const steps = useMemo(() => frequencyScale.getSteps(), [ frequencyScale ])
  useAxis({
    canvas: yAxisCanvasRef?.current,
    pixelSize: height,
    orientation: 'vertical',
    valueToString: frequencyToString,
    steps,
    displaySmallStepValue: true,
  })

  return <canvas ref={ yAxisCanvasRef }
                 className={ styles.yAxis }
                 width={ Y_AXIS_WIDTH }
                 height={ height }/>
}
