import React, { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Annotation } from './slice';
import { ExtendedDiv, ScaleService } from '@/components/ui';
import styles from './styles.module.scss';
import { MOUSE_DOWN_EVENT } from '@/features/UX/Events';
import { AnnotationHeadContent } from './Head';
import { AnnotationType, useAnnotationTask } from '@/api';
import { formatTime } from '@/service/function';
import { useAnnotatorAnnotation } from './hooks';
import { useAnnotatorLabel } from '@/features/Annotator/Label';
import { useAnnotatorUX } from '@/features/Annotator/UX';
import { useFrequencyAxis, useTimeAxis } from '@/features/Annotator/Axis';

export const StrongAnnotation: React.FC<{
  annotation: Annotation
}> = ({ annotation }) => {
  const { spectrogram, isEditionAuthorized } = useAnnotationTask()
  const { focus: _focus, focusedAnnotation, updateAnnotation } = useAnnotatorAnnotation()
  const focus = useCallback(() => _focus(annotation), [ annotation, _focus ])
  const { allLabels, hiddenLabels } = useAnnotatorLabel()
  const { canDraw } = useAnnotatorUX()
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
    return annotation.validation?.is_valid
  }, [ hiddenLabels, annotation ])

  // Time / Frequency
  const _startTime = useRef<number | null | undefined>();
  const _endTime = useRef<number | null | undefined>();
  const _startFrequency = useRef<number | null | undefined>();
  const _endFrequency = useRef<number | null | undefined>();
  useEffect(() => {
    _startTime.current = annotation.update?.start_time ?? annotation.start_time;
    _endTime.current = annotation.update?.end_time ?? annotation.end_time;
    _startFrequency.current = annotation.update?.start_frequency ?? annotation.start_frequency;
    _endFrequency.current = annotation.update?.end_frequency ?? annotation.end_frequency;
  }, [ annotation ]);

  // Scales
  const { timeScale } = useTimeAxis()
  const { frequencyScale } = useFrequencyAxis()
  const timeScaleRef = useRef<ScaleService>(timeScale);
  const frequencyScaleRef = useRef<ScaleService>(frequencyScale);
  useEffect(() => {
    timeScaleRef.current = timeScale;
    frequencyScaleRef.current = frequencyScale;
  }, [ timeScale, frequencyScale ]);

  // Positions
  const [ left, setLeft ] = useState<number>(0);
  const [ width, setWidth ] = useState<number>(0);
  const [ top, setTop ] = useState<number>(0);
  const [ height, setHeight ] = useState<number>(0);
  const _left = useRef<number>(0);
  const _width = useRef<number>(0);
  const _top = useRef<number>(0);
  const _height = useRef<number>(0);
  useEffect(() => updateLeft, [ timeScaleRef.current, _startTime.current ]);
  useEffect(() => updateWidth, [ timeScaleRef.current, _startTime.current, _endTime.current ]);
  useEffect(() => updateTop, [ frequencyScaleRef.current, _endFrequency.current ]);
  useEffect(() => updateHeight, [ frequencyScaleRef.current, _startFrequency.current, _endFrequency.current ]);
  const updateLeft = useCallback(() => {
    if (typeof _startTime.current !== 'number') return;
    _left.current = timeScaleRef.current.valueToPosition(_startTime.current);
    setLeft(_left.current)
  }, [ setLeft ])
  const updateTop = useCallback(() => {
    if (typeof _endFrequency.current !== 'number') return;
    _top.current = frequencyScaleRef.current.valueToPosition(_endFrequency.current);
    setTop(_top.current)
  }, [ setTop ])
  const updateWidth = useCallback(() => {
    if (typeof _startTime.current !== 'number' || typeof _endTime.current !== 'number') return;
    _width.current = timeScaleRef.current.valuesToPositionRange(_startTime.current, _endTime.current);
    setWidth(_width.current)
  }, [ setWidth ])
  const updateHeight = useCallback(() => {
    if (typeof _startFrequency.current !== 'number' || typeof _endFrequency.current !== 'number') return;
    _height.current = frequencyScaleRef.current.valuesToPositionRange(_startFrequency.current, _endFrequency.current);
    setHeight(_height.current)
  }, [ setHeight ])

  // Movements
  const onTopMove = useCallback((movement: number) => {
    _top.current += movement;
    setTop(_top.current)
  }, [ setTop ])
  const onHeightMove = useCallback((movement: number) => {
    _height.current += movement;
    setHeight(_height.current)
  }, [ setHeight ])
  const onLeftMove = useCallback((movement: number) => {
    _left.current += movement;
    setLeft(_left.current)
  }, [ setLeft ])
  const onWidthMove = useCallback((movement: number) => {
    _width.current += movement;
    setWidth(_width.current)
  }, [ setWidth ])
  const onValidateMove = useCallback(() => {
    let end_frequency = frequencyScaleRef.current.positionToValue(_top.current);
    let start_frequency = frequencyScaleRef.current.positionToValue(_top.current + _height.current);
    let start_time = timeScaleRef.current.positionToValue(_left.current);
    let end_time = timeScaleRef.current.positionToValue(_left.current + _width.current);
    if (_startTime.current && formatTime(start_time, true) === formatTime(_startTime.current, true)) start_time = _startTime.current;
    if (_endTime.current && formatTime(end_time, true) === formatTime(_endTime.current, true)) end_time = _endTime.current;
    if (_startFrequency.current && _startFrequency.current.toFixed(2) === start_frequency.toFixed(2)) start_frequency = _startFrequency.current;
    if (_endFrequency.current && _endFrequency.current.toFixed(2) === end_frequency.toFixed(2)) end_frequency = _endFrequency.current;
    switch (annotation.type) {
      case AnnotationType.Box:
        updateAnnotation(annotation, { start_time, end_time, start_frequency, end_frequency })
        break;
      case AnnotationType.Point:
        updateAnnotation(annotation, { start_time, start_frequency })
        break;
    }
  }, [ updateAnnotation, annotation ])

  // Style
  const colorClassName: string = useMemo(() => {
    return `ion-color-${ allLabels.indexOf(annotation.update?.label ?? annotation.label) % 10 }`
  }, [ allLabels, annotation ]);
  const headerClass: string = useMemo(() => {
    if (!spectrogram || annotation.type === 'Weak') return ''
    let stickSideClass = ''
    const end = annotation.type === 'Box' ? annotation.end_time! : annotation.start_time!;
    if (end > (spectrogram.duration * 0.9))
      stickSideClass = styles.stickRight
    if (annotation.start_time! < (spectrogram.duration * 0.1))
      stickSideClass = styles.stickLeft
    return [
      styles.header,
      stickSideClass,
      colorClassName,
      canDraw ? '' : styles.editDisabled,
      top < 24 ? styles.bellow : styles.over,
    ].join(' ')
  }, [ spectrogram, annotation, colorClassName, canDraw, top ])

  if (annotation.type === AnnotationType.Weak) return <Fragment/>
  if (isHidden) return <Fragment/>
  return <ExtendedDiv resizable={ isActive && canDraw }
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
                        canDraw ? '' : styles.editDisabled,
                      ].join(' ') }>

    { (isMouseHover || isActive) &&
        <ExtendedDiv draggable={ isActive && canDraw }
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