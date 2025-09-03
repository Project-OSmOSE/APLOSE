import React, { MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import styles from '../../styles.module.scss'
import { ExtendedDiv } from '@/components/ui/ExtendedDiv';
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { AnnotationHeader } from './Headers';
import {
  AbstractScale,
  Annotation,
  useAnnotatorAnnotations,
  useAnnotatorLabel,
  useAnnotatorUI,
  useAxis
} from "@/features/Annotator";

export const Point: React.FC<{
  annotation: Annotation
  audioPlayer: MutableRefObject<HTMLAudioElement | null>;
}> = ({ annotation, audioPlayer }) => {
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
  const _startFrequency = useRef<number | null | undefined>(finalAnnotation.startFrequency);
  useEffect(() => {
    _startTime.current = finalAnnotation.startTime;
    _startFrequency.current = finalAnnotation.startFrequency;
  }, [ finalAnnotation.startTime, finalAnnotation.startFrequency ]);


  // Coords bounds
  const _left = useRef<number>(0);
  const _top = useRef<number>(0);

  // State
  const [ left, setLeft ] = useState<number>(0);
  const [ top, setTop ] = useState<number>(0);
  const [ isMouseHover, setIsMouseHover ] = useState<boolean>(false);

  // Updates
  useEffect(() => {
    updateLeft()
    updateTop()
  }, []);
  useEffect(() => updateLeft, [ _xAxis.current, _startTime.current ]);
  useEffect(() => updateTop, [ _yAxis.current, _startFrequency.current ]);
  useEffect(() => setTop(_top.current), [ _top.current ]);
  useEffect(() => setLeft(_left.current), [ _left.current ]);

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
  }

  function updateTop() {
    if (typeof _startFrequency.current !== 'number') return;
    _top.current = _yAxis.current.valueToPosition(_startFrequency.current);
  }

  function onTopMove(movement: number) {
    _top.current += movement;
  }

  function onLeftMove(movement: number) {
    _left.current += movement;
  }

  function onValidateMove() {
    if (!phase) return;
    update(annotation, {
      startTime: _xAxis.current.positionToValue(_left.current),
      endTime: null,
      startFrequency: _yAxis.current.positionToValue(_top.current),
      endFrequency: null,
    })
  }

  return <ExtendedDiv draggable={ isActive && !isAnnotationDisabled }
                      top={ top }
                      left={ left }
                      onUp={ onValidateMove }
                      onTopMove={ onTopMove }
                      onLeftMove={ onLeftMove }
                      onMouseEnter={ () => setIsMouseHover(true) }
                      onMouseLeave={ () => setIsMouseHover(false) }
                      className={ [
                        styles.point,
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
                          className={ [
                            colorClassName,
                            isAnnotationDisabled ? styles.editDisabled : ''
                          ].join(' ') }
                          annotation={ annotation }
                          audioPlayer={ audioPlayer }/> }

    <div className={ styles.vertical }/>
    <div className={ styles.horizontal }/>

  </ExtendedDiv>
}