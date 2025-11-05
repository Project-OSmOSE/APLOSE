import React, { MouseEvent, useCallback } from 'react';
import styles from './styles.module.scss';
import { FrequencyAxis, TimeAxis } from '@/features/Annotator/Axis';
import { TimeBar } from './TimeBar';
import {
  AcousticFeatures,
  StrongAnnotation,
  useAnnotatorAnnotation,
  useAnnotatorTempAnnotation,
} from '@/features/Annotator/Annotation';
import { useAnnotatorWindow } from './window.hooks';
import { useAnnotatorCanvas } from './hooks';
import { useAnnotatorPointer } from '@/features/Annotator/Pointer';
import { useAnnotatorZoom } from '@/features/Annotator/Zoom';
import { useAnnotatorUX } from '@/features/Annotator/UX';
import { useAudio } from '@/features/Audio';

export const AnnotatorCanvasWindow: React.FC = () => {
  const { yAxisWidth, containerWidth, height, width } = useAnnotatorWindow()
  const { setMainCanvas, setWindow } = useAnnotatorCanvas()
  const { onStartTempAnnotation } = useAnnotatorTempAnnotation()
  const { clearPosition, getFreqTime } = useAnnotatorPointer()
  const { onWheel } = useAnnotatorZoom()
  const { canDraw, onFileScrolled } = useAnnotatorUX()
  const { seek } = useAudio()
  const { allAnnotations } = useAnnotatorAnnotation()

  const seekAudio = useCallback((event: MouseEvent<HTMLCanvasElement>) => {
    seek(getFreqTime(event)?.time ?? 0)
  }, [ seek, getFreqTime ])

  return <div className={ styles.spectrogramWindow }
              ref={ ref => ref && setWindow(ref) }
              onScroll={ onFileScrolled }
              style={ { width: `${ yAxisWidth + containerWidth }px` } }>

    <TimeAxis/>
    <FrequencyAxis/>

    <div className={ styles.spectrogram }
         onWheel={ onWheel }
         onPointerLeave={ clearPosition }
         onMouseDown={ e => e.stopPropagation() }>

      <canvas className={ canDraw ? styles.drawable : '' }
              data-testid="drawable-canvas"
              ref={ ref => ref && setMainCanvas(ref) }
              height={ height }
              width={ width }
              onMouseDown={ onStartTempAnnotation }
              onClick={ seekAudio }/>

      <TimeBar/>

      { allAnnotations.map(annotation => <StrongAnnotation key={ annotation.id } annotation={ annotation }/>) }
    </div>

    <AcousticFeatures/>

  </div>
}
