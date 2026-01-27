import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Annotation, focusAnnotation } from './slice';
import { ExtendedDiv } from '@/components/ui';
import styles from './styles.module.scss';
import { MOUSE_DOWN_EVENT } from '@/features/UX/Events';
import { AnnotationHeadContent } from './Head';
import { AnnotationType, useAnnotationTask } from '@/api';
import { formatTime } from '@/service/function';
import { useUpdateAnnotation } from './hooks';
import { selectAllLabels, selectHiddenLabels } from '@/features/Annotator/Label';
import { selectIsDrawingEnabled, selectIsSelectingPositionForAnnotation } from '@/features/Annotator/UX';
import { useFrequencyScale, useTimeScale } from '@/features/Annotator/Axis';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';

export const StrongAnnotation: React.FC<{
  annotation: Annotation
}> = ({ annotation }) => {
  const isEditionAuthorized = useAppSelector(selectTaskIsEditionAuthorized)
  const { spectrogram } = useAnnotationTask()
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const updateAnnotation = useUpdateAnnotation()
  const allLabels = useAppSelector(selectAllLabels)
  const hiddenLabels = useAppSelector(selectHiddenLabels)
  const isDrawingEnabled = useAppSelector(selectIsDrawingEnabled)
  const isActive = useMemo(() => {
    if (!isEditionAuthorized) return false;
    return annotation.id === focusedAnnotation?.id
  }, [ isEditionAuthorized, annotation, focusedAnnotation ]);
  const [ isMouseHover, setIsMouseHover ] = useState<boolean>(false);
  const isHidden = useMemo(() => {
    if (hiddenLabels.includes(annotation.label)) return true
    // Hide updated annotations
    if (annotation.update) return false;
    // Hide invalidated annotations
    return annotation.validation?.isValid == false;
  }, [ hiddenLabels, annotation ])
  const dispatch = useAppDispatch();
  const isSelectingAnnotationFrequency = useAppSelector(selectIsSelectingPositionForAnnotation)

  const focus = useCallback(() => dispatch(focusAnnotation(annotation)), [ annotation, dispatch ])

  // Time / Frequency
  const startTime = useMemo(() => annotation.update?.startTime ?? annotation.startTime, [ annotation ])
  const endTime = useMemo(() => annotation.update?.endTime ?? annotation.endTime, [ annotation ])
  const startFrequency = useMemo(() => annotation.update?.startFrequency ?? annotation.startFrequency, [ annotation ])
  const endFrequency = useMemo(() => annotation.update?.endFrequency ?? annotation.endFrequency, [ annotation ])

  // Scales
  const timeScale = useTimeScale()
  const frequencyScale = useFrequencyScale()

  // Positions
  const [ left, setLeft ] = useState<number>(0);
  const [ width, setWidth ] = useState<number>(0);
  const [ top, setTop ] = useState<number>(0);
  const [ height, setHeight ] = useState<number>(0);
  useEffect(() => {
    switch (annotation.type) {
      case AnnotationType.Box:
        setLeft(timeScale.valueToPosition(startTime!))
        setWidth(timeScale.valuesToPositionRange(startTime!, endTime!))
        setTop(frequencyScale.valueToPosition(endFrequency!))
        setHeight(frequencyScale.valuesToPositionRange(startFrequency!, endFrequency!))
        break;
      case AnnotationType.Point:
        setLeft(timeScale.valueToPosition(startTime!))
        setTop(frequencyScale.valueToPosition(startFrequency!))
        break;
    }
  }, [ timeScale, frequencyScale, annotation ]);

  // Movements
  const onTopMove = useCallback((movement: number) => {
    setTop(prev => prev + movement)
  }, [ setTop ])
  const onHeightMove = useCallback((movement: number) => {
    setHeight(prev => prev + movement)
  }, [ setHeight ])
  const onLeftMove = useCallback((movement: number) => {
    setLeft(prev => prev + movement)
  }, [ setLeft ])
  const onWidthMove = useCallback((movement: number) => {
    setWidth(prev => prev + movement)
  }, [ setWidth ])

  const onValidateMove = useCallback(() => {
    let newStartTime = timeScale.positionToValue(left);
    let newEndTime = timeScale.positionToValue(left + width);
    let newEndFrequency = frequencyScale.positionToValue(top);
    let newStartFrequency = frequencyScale.positionToValue(top + height);
    if (startTime && formatTime(newStartTime, true) === formatTime(startTime, true)) newStartTime = startTime;
    if (endTime && formatTime(newEndTime, true) === formatTime(endTime, true)) newEndTime = endTime;
    if (startFrequency && startFrequency.toFixed(2) === newStartFrequency.toFixed(2)) newStartFrequency = startFrequency;
    if (endFrequency && endFrequency.toFixed(2) === newEndFrequency.toFixed(2)) newEndFrequency = endFrequency;
    switch (annotation.type) {
      case AnnotationType.Box:
        updateAnnotation(annotation, {
          startTime: newStartTime,
          endTime: newEndTime,
          startFrequency: newStartFrequency,
          endFrequency: newEndFrequency,
        })
        break;
      case AnnotationType.Point:
        updateAnnotation(annotation, {
          startTime: newStartTime,
          startFrequency: newStartFrequency,
        })
        break;
    }
  }, [ updateAnnotation, annotation, timeScale, frequencyScale, left, top, height, width, startTime, endTime, startFrequency, endFrequency ])

  // Style
  const colorClassName: string = useMemo(() => {
    return `ion-color-${ allLabels.indexOf(annotation.update?.label ?? annotation.label) % 10 }`
  }, [ allLabels, annotation ]);
  const headerClass: string = useMemo(() => {
    if (!spectrogram || annotation.type === 'Weak') return ''
    let stickSideClass = ''
    const end = annotation.type === 'Box' ? annotation.endTime! : annotation.startTime!;
    if (end > (spectrogram.duration * 0.9))
      stickSideClass = styles.stickRight
    if (annotation.startTime! < (spectrogram.duration * 0.1))
      stickSideClass = styles.stickLeft
    return [
      styles.header,
      stickSideClass,
      colorClassName,
      isDrawingEnabled ? '' : styles.editDisabled,
      top < 24 ? styles.bellow : styles.over,
    ].join(' ')
  }, [ spectrogram, annotation, colorClassName, isDrawingEnabled, top ])

  if (annotation.type === AnnotationType.Weak) return <Fragment/>
  if (isHidden) return <Fragment/>
  return <ExtendedDiv resizable={ isActive && isDrawingEnabled }
                      top={ top } left={ left }
                      width={ annotation.type === AnnotationType.Box ? width : undefined }
                      height={ annotation.type === AnnotationType.Box ? height : undefined }
                      onUp={ onValidateMove }
                      onTopMove={ onTopMove } onLeftMove={ onLeftMove }
                      onWidthMove={ annotation.type === AnnotationType.Box ? onWidthMove : undefined }
                      onHeightMove={ annotation.type === AnnotationType.Box ? onHeightMove : undefined }
                      onMouseEnter={ () => setIsMouseHover(true) }
                      onMouseMove={ () => setIsMouseHover(true) }
                      onMouseLeave={ () => setIsMouseHover(false) }
                      innerClassName={ styles.inner }
                      onInnerMouseDown={ MOUSE_DOWN_EVENT.emit.bind(MOUSE_DOWN_EVENT) }
                      className={ [
                        annotation.type === AnnotationType.Box ? styles.annotation : styles.point,
                        colorClassName,
                        isActive ? '' : styles.disabled,
                        isDrawingEnabled ? '' : styles.editDisabled,
                        isActive && isSelectingAnnotationFrequency ? styles.pointerSelect : ''
                      ].join(' ') }>

    { (isMouseHover || isActive) &&
        <ExtendedDiv draggable={ isActive && isDrawingEnabled }
                     onTopMove={ onTopMove } onLeftMove={ onLeftMove }
                     onUp={ onValidateMove }
                     onMouseEnter={ () => setIsMouseHover(true) }
                     onMouseMove={ () => setIsMouseHover(true) }
                     onMouseLeave={ () => setIsMouseHover(false) }
                     className={ headerClass }
                     innerClassName={ styles.inner }
                     onClick={ focus }>
            <AnnotationHeadContent annotation={ annotation }/>
        </ExtendedDiv> }

    { annotation.type === AnnotationType.Point && <Fragment>
        <div className={ styles.vertical }/>
        <div className={ styles.horizontal }/>
    </Fragment> }

  </ExtendedDiv>
}