import React, { Fragment, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react'
import styles from '../../styles.module.scss'
import { ExtendedDiv } from '@/components/ui/ExtendedDiv';
import { formatTime } from "@/service/function";
import {
  AbstractScale,
  Annotation,
  useAnnotatorAnnotations,
  useAnnotatorLabel,
  useAnnotatorUI,
  useAxis
} from "@/features/Annotator";
import { MOUSE_DOWN_EVENT } from "@/service/events";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { AnnotationHeader } from './Headers';

type RegionProps = {
  annotation: Annotation,
  audioPlayer: MutableRefObject<HTMLAudioElement | null>;
};


export const Box: React.FC<RegionProps> = ({
                                             annotation,
                                             audioPlayer
                                           }) => {
  const { annotationID, getAnnotationUpdate, update } = useAnnotatorAnnotations()
  const { isAnnotationDisabled } = useAnnotatorUI()
  const { labels } = useAnnotatorLabel()
  const finalAnnotation = useMemo(() => {
    return getAnnotationUpdate(annotation) ?? annotation
  }, [ annotation, getAnnotationUpdate ])
  const { campaign } = useRetrieveCurrentCampaign();
  const { phase } = useRetrieveCurrentPhase()

  // Scales
  const { xAxis, yAxis } = useAxis()
  const _xAxis = useRef<AbstractScale>(xAxis);
  const _yAxis = useRef<AbstractScale>(yAxis);
  useEffect(() => {
    _xAxis.current = xAxis;
  }, [ xAxis ]);
  useEffect(() => {
    _yAxis.current = yAxis;
  }, [ yAxis ]);

  // Annotation time/freq bounds
  const _startTime = useRef<number | null | undefined>(finalAnnotation.startTime);
  const _endTime = useRef<number | null | undefined>(finalAnnotation.endTime);
  const _startFrequency = useRef<number | null | undefined>(finalAnnotation.startFrequency);
  const _endFrequency = useRef<number | null | undefined>(finalAnnotation.endFrequency);
  useEffect(() => {
    _startTime.current = finalAnnotation.startTime;
    _endTime.current = finalAnnotation.endTime;
    _startFrequency.current = finalAnnotation.startFrequency;
    _endFrequency.current = finalAnnotation.endFrequency;
  }, [ finalAnnotation ]);

  // Coords bounds
  const _left = useRef<number>(0);
  const _width = useRef<number>(0);
  const _top = useRef<number>(0);
  const _height = useRef<number>(0);

  // State
  const [ left, setLeft ] = useState<number>(0);
  const [ width, setWidth ] = useState<number>(0);
  const [ top, setTop ] = useState<number>(0);
  const [ height, setHeight ] = useState<number>(0);
  const [ isMouseHover, setIsMouseHover ] = useState<boolean>(false);

  // Updates
  useEffect(() => {
    updateLeft()
    updateWidth()
    updateTop()
    updateHeight()
  }, []);
  useEffect(() => updateLeft, [ _xAxis.current, _startTime.current ]);
  useEffect(() => updateWidth, [ _xAxis.current, _startTime.current, _endTime.current ]);
  useEffect(() => updateTop, [ _yAxis.current, _endFrequency.current ]);
  useEffect(() => updateHeight, [ _yAxis.current, _startFrequency.current, _endFrequency.current ]);

  // Memo
  const colorClassName: string = useMemo(() => {
    return `ion-color-${ labels.map(l => l.name).indexOf(finalAnnotation.label.name) % 10 }`
  }, [ labels, finalAnnotation ]);
  const isActive = useMemo(() => {
    if (campaign?.archive) return false;
    if (phase?.ended_at) return false;
    return annotation.id === annotationID
  }, [ campaign, phase, annotation.id, annotationID, ]);

  function updateLeft() {
    if (typeof _startTime.current !== 'number') return;
    _left.current = _xAxis.current.valueToPosition(_startTime.current);
    setLeft(_left.current)
  }

  function updateTop() {
    if (typeof _endFrequency.current !== 'number') return;
    _top.current = _yAxis.current.valueToPosition(_endFrequency.current);
    setTop(_top.current)
  }

  function updateWidth() {
    if (typeof _startTime.current !== 'number' || typeof _endTime.current !== 'number') return;
    _width.current = _xAxis.current.valuesToPositionRange(_startTime.current, _endTime.current);
    setWidth(_width.current)
  }

  function updateHeight() {
    if (typeof _startFrequency.current !== 'number' || typeof _endFrequency.current !== 'number') return;
    _height.current = _yAxis.current.valuesToPositionRange(_startFrequency.current, _endFrequency.current);
    setHeight(_height.current)
  }

  function onTopMove(movement: number) {
    _top.current += movement;
    setTop(_top.current)
  }

  function onHeightMove(movement: number) {
    _height.current += movement;
    setHeight(_height.current)
  }

  function onLeftMove(movement: number) {
    _left.current += movement;
    setLeft(_left.current)
  }

  function onWidthMove(movement: number) {
    _width.current += movement;
    setWidth(_width.current)
  }

  function onValidateMove() {
    if (!phase) return;
    let endFrequency = _yAxis.current.positionToValue(_top.current);
    let startFrequency = _yAxis.current.positionToValue(_top.current + _height.current);
    let startTime = _xAxis.current.positionToValue(_left.current);
    let endTime = _xAxis.current.positionToValue(_left.current + _width.current);
    if (_startTime.current && formatTime(startTime, true) === formatTime(_startTime.current, true)) startTime = _startTime.current;
    if (_endTime.current && formatTime(endTime, true) === formatTime(_endTime.current, true)) endTime = _endTime.current;
    if (_startFrequency.current && _startFrequency.current.toFixed(2) === startFrequency.toFixed(2)) startFrequency = _startFrequency.current;
    if (_endFrequency.current && _endFrequency.current.toFixed(2) === endFrequency.toFixed(2)) endFrequency = _endFrequency.current;
    update(annotation, { startTime, endTime, startFrequency, endFrequency })
  }

  if (top === null || left === null || height === null || width === null) return <Fragment/>
  return <ExtendedDiv resizable={ isActive && !isAnnotationDisabled }
                      top={ top } height={ height }
                      left={ left } width={ width }
                      onUp={ onValidateMove }
                      onTopMove={ onTopMove } onHeightMove={ onHeightMove }
                      onLeftMove={ onLeftMove } onWidthMove={ onWidthMove }
                      onMouseEnter={ () => setIsMouseHover(true) }
                      onMouseMove={ () => setIsMouseHover(true) }
                      onMouseLeave={ () => setIsMouseHover(false) }
                      innerClassName={ styles.inner }
                      onInnerMouseDown={ MOUSE_DOWN_EVENT.emit.bind(MOUSE_DOWN_EVENT) }
                      className={ [
                        styles.annotation,
                        colorClassName,
                        isActive ? '' : styles.disabled,
                        isAnnotationDisabled ? styles.editDisabled : ''
                      ].join(' ') }>

    { (isMouseHover || isActive) &&
        <AnnotationHeader active={ isActive && !isAnnotationDisabled }
                          onTopMove={ onTopMove }
                          onLeftMove={ onLeftMove }
                          onValidateMove={ onValidateMove }
                          top={ top }
                          setIsMouseHover={ setIsMouseHover }
                          className={ [
                            colorClassName,
                            isAnnotationDisabled ? styles.editDisabled : ''
                          ].join(' ') }
                          annotation={ annotation }
                          audioPlayer={ audioPlayer }/> }

  </ExtendedDiv>
}
