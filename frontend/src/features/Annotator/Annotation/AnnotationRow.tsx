import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import type { Annotation } from './slice';
import { TableContent, useAlert, useModal } from '@/components/ui';
import styles from './styles.module.scss';
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import { AnnotationPhaseType, AnnotationType, useAnnotationTask, useCurrentCampaign, useCurrentUser } from '@/api';
import { useAnnotatorAnnotation } from './hooks';
import { useAnnotatorCanvas } from '@/features/Annotator/Canvas';
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

export const AnnotationRow: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  const { phaseType } = useParams<AploseNavParams>();
  const { campaign } = useCurrentCampaign()
  const { focusedAnnotation, focus, validate, invalidate, removeAnnotation, getAnnotations } = useAnnotatorAnnotation()
  const { annotations } = useAnnotationTask()
  const { focusTime } = useAnnotatorCanvas()
  const { user } = useCurrentUser()
  const invalidateModal = useModal()
  const alert = useAlert()

  const completeInfo = useMemo(() => {
    return annotations?.find(a => a.id === annotation.id.toString())
  }, [ annotations, annotation ])

  const isActive = useMemo(() => annotation.id === focusedAnnotation?.id ? styles.active : undefined, [ annotation, focusedAnnotation ])

  const className = useMemo(() => {
    return [ styles.item, isActive ].join(' ')
  }, [ isActive ])

  const onClick = useCallback(() => {
    focus(annotation)
    if (typeof annotation.startTime !== 'number') return;
    let time: number;
    if (typeof annotation.endTime !== 'number') time = annotation.startTime;
    else time = annotation.startTime + Math.abs(annotation.endTime - annotation.startTime) / 2;
    focusTime(time)
  }, [ focus, annotation, focusTime ])

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
    if (annotation.type === AnnotationType.Weak) {
      // if weak annotations exists with this label: wait for confirmation
      alert.showAlert({
        type: 'Warning',
        message: `You are about to remove ${ getAnnotations({ label: annotation.label }).length } annotations using "${ annotation.label }" label. Are you sure?`,
        actions: [ {
          label: `Remove "${ annotation.label }" annotations`,
          callback: () => {
            getAnnotations({ label: annotation.label }).forEach(removeAnnotation)
          },
        } ],
      })
    } else {
      removeAnnotation(annotation)
    }
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
          <p>{ completeInfo?.annotator?.displayName }</p>
        </TableContent>
    ) }

    {/* Comments */ }
    <TableContent className={ className } onClick={ onClick }>
      { annotation.comments && annotation.comments.length > 0 ? <IoChatbubbleEllipses/> : <IoChatbubbleOutline/> }
    </TableContent>

    {/* Validation */ }
    <TableContent className={ className } onClick={ onClick }>
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
    </TableContent>


    <InvalidateAnnotationModal isOpen={ invalidateModal.isOpen }
                               onClose={ invalidateModal.close }
                               annotation={ annotation }/>
  </Fragment>
}
