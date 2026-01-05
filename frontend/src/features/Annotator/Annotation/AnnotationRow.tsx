import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import { type Annotation, focusAnnotation } from './slice';
import { TableContent, useModal } from '@/components/ui';
import styles from './styles.module.scss';
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import { AnnotationPhaseType, AnnotationType, useAnnotationTask, useCurrentCampaign, useCurrentUser } from '@/api';
import { useGetAnnotations, useInvalidateAnnotation, useRemoveAnnotation, useValidateAnnotation } from './hooks';
import { useFocusCanvasOnTime } from '@/features/Annotator/Canvas';
import { AnnotationTimeInfo } from './AnnotationTimeInfo';
import { AnnotationFrequencyInfo } from './AnnotationFrequencyInfo';
import { AnnotationConfidenceInfo } from '@/features/Annotator/Annotation/AnnotationConfidenceInfo';
import { RiRobot2Fill, RiUser3Fill } from 'react-icons/ri';
import { IoChatbubbleEllipses, IoChatbubbleOutline } from 'react-icons/io5';
import { InvalidateAnnotationModal } from '@/features/Annotator/Annotation/InvalidateAnnotationModal';
import { IonButton, IonIcon } from '@ionic/react';
import { checkmarkOutline, closeOutline } from 'ionicons/icons/index.js';
import { type AploseNavParams, useKeyDownEvent } from '@/features/UX';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';

export const AnnotationRow: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  const { phaseType } = useParams<AploseNavParams>();
  const { campaign } = useCurrentCampaign()
  const focusedAnnotation = useAppSelector(selectAnnotation)
  const getAnnotations = useGetAnnotations()
  const validate = useValidateAnnotation()
  const invalidate = useInvalidateAnnotation()
  const removeAnnotation = useRemoveAnnotation()
  const { annotations } = useAnnotationTask()
  const focusTime = useFocusCanvasOnTime()
  const { user } = useCurrentUser()
  const invalidateModal = useModal()
  const dispatch = useAppDispatch();

  const completeInfo = useMemo(() => {
    return annotations?.find(a => a.id === annotation.id.toString())
  }, [ annotations, annotation ])

  const isActive = useMemo(() => annotation.id === focusedAnnotation?.id ? styles.active : undefined, [ annotation, focusedAnnotation ])

  const className = useMemo(() => {
    return [ styles.item, isActive ].join(' ')
  }, [ isActive ])

  const onClick = useCallback(() => {
    dispatch(focusAnnotation(annotation))
    if (typeof annotation.startTime !== 'number') return;
    let time: number;
    if (typeof annotation.endTime !== 'number') time = annotation.startTime;
    else time = annotation.startTime + Math.abs(annotation.endTime - annotation.startTime) / 2;
    focusTime(time)
  }, [ dispatch, annotation, focusTime ])

  const onValidate = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    validate(annotation);
  }, [ annotation ]);

  const onInvalidate = useCallback((event: MouseEvent) => {
    event.stopPropagation()
    if (annotation.type === 'Weak') invalidate(annotation)
    else invalidateModal.open()
  }, [ annotation, invalidate, annotation, invalidateModal ]);

  const remove = useCallback(() => {
    if (!isActive) return;
    removeAnnotation(annotation)
  }, [ annotation, removeAnnotation, isActive, getAnnotations ]);
  useKeyDownEvent([ 'Delete' ], remove);

  return <Fragment>

    {/* Label */ }
    <TableContent isFirstColumn={ true }
                  className={ [ className, annotation.type === AnnotationType.Weak ? styles.presenceLabel : styles.strongLabel ].join(' ') }
                  onClick={ onClick }>
      <AnnotationLabelInfo annotation={ annotation }/>
    </TableContent>

    {/* Time & Frequency */ }
    { annotation.type !== AnnotationType.Weak && <Fragment>
        <TableContent className={ className } onClick={ onClick }>
            <AnnotationTimeInfo annotation={ annotation }/>
        </TableContent>
        <TableContent className={ className } onClick={ onClick }>
            <AnnotationFrequencyInfo annotation={ annotation }/>
        </TableContent>
    </Fragment> }

    {/* Confidence */ }
    { campaign?.confidenceSet && <TableContent className={ className } onClick={ onClick }>
        <AnnotationConfidenceInfo annotation={ annotation }/>
    </TableContent> }

    {/* Detector | Annotator */ }
    { phaseType === AnnotationPhaseType.Verification && (
      completeInfo?.detectorConfiguration ?
        <TableContent className={ className } onClick={ onClick }>
          <RiRobot2Fill/>
          <p>{ completeInfo?.detectorConfiguration.detector.name }</p>
        </TableContent>
        :
        <TableContent
          className={ [ className, completeInfo?.annotator?.id === user?.id ? 'disabled' : '' ].join(' ') }
          onClick={ onClick }>
          <RiUser3Fill/>
          <p>{ completeInfo?.annotator?.displayName } { completeInfo?.annotator?.id === user?.id ? '(self)' : '' }</p>
        </TableContent>
    ) }

    {/* Comments */ }
    <TableContent className={ className } onClick={ onClick }>
      { annotation.comments && annotation.comments.length > 0 ? <IoChatbubbleEllipses/> : <IoChatbubbleOutline/> }
    </TableContent>

    {/* Validation */ }
    { phaseType === AnnotationPhaseType.Verification &&
        <TableContent className={ className } onClick={ onClick }>
          { completeInfo?.annotator?.id !== user?.id ? <Fragment>
            <IonButton className="validate"
                       data-testid="validate"
                       color={ annotation.validation?.isValid ? 'success' : 'medium' }
                       fill={ annotation.validation?.isValid ? 'solid' : 'outline' }
                       onClick={ onValidate }>
                <IonIcon slot="icon-only" icon={ checkmarkOutline }/>
            </IonButton>
            <IonButton className="invalidate"
                       data-testid="invalidate"
                       color={ annotation.validation?.isValid ? 'medium' : 'danger' }
                       fill={ annotation.validation?.isValid ? 'outline' : 'solid' }
                       onClick={ onInvalidate }>
                <IonIcon slot="icon-only" icon={ closeOutline }/>
            </IonButton>
          </Fragment> : <Fragment/> }
        </TableContent> }


    <InvalidateAnnotationModal isOpen={ invalidateModal.isOpen }
                               onClose={ invalidateModal.close }
                               annotation={ annotation }/>
  </Fragment>
}
