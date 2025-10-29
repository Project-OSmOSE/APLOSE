import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import type { Annotation } from './slice';
import { TableContent, useModal } from '@/components/ui';
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
import { useNavParams } from '@/features/UX';

export const AnnotationRow: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  const { phaseType } = useNavParams();
  const { campaign } = useCurrentCampaign()
  const { focusedAnnotation, focus, validate, invalidate } = useAnnotatorAnnotation()
  const { annotations } = useAnnotationTask()
  const { focusTime } = useAnnotatorCanvas()
  const { user } = useCurrentUser()
  const invalidateModal = useModal()

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

  return <Fragment>
    <TableContent isFirstColumn={ true }
                  className={ [ className, annotation.type === AnnotationType.Weak ? styles.presenceLabel : styles.strongLabel ].join(' ') }
                  onClick={ onClick }>
      <AnnotationLabelInfo annotation={ annotation }/>
      { annotation.type !== AnnotationType.Weak && <Fragment>
          <TableContent className={ className } onClick={ onClick }>
              <AnnotationTimeInfo annotation={ annotation }/>
          </TableContent>
          <TableContent className={ className } onClick={ onClick }>
              <AnnotationFrequencyInfo annotation={ annotation }/>
          </TableContent>
      </Fragment> }
      { campaign?.confidenceSet && <TableContent className={ className } onClick={ onClick }>
          <AnnotationConfidenceInfo annotation={ annotation }/>
      </TableContent> }
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
      <TableContent className={ className } onClick={ onClick }>
        { annotation.comments && annotation.comments.length > 0 ? <IoChatbubbleEllipses/> : <IoChatbubbleOutline/> }
      </TableContent>
    </TableContent>
    <TableContent className={ className } onClick={ onClick }>
      <IonButton className="validate"
                 color={ annotation.validation ? 'success' : 'medium' }
                 fill={ annotation.validation ? 'solid' : 'outline' }
                 onClick={ onValidate }>
        <IonIcon slot="icon-only" icon={ checkmarkOutline }/>
      </IonButton>
      <IonButton className="invalidate"
                 color={ annotation.validation ? 'medium' : 'danger' }
                 fill={ annotation.validation ? 'outline' : 'solid' }
                 onClick={ onInvalidate }>
        <IonIcon slot="icon-only" icon={ closeOutline }/>
      </IonButton>
    </TableContent>


    { invalidateModal.isOpen && <InvalidateAnnotationModal onClose={ invalidateModal.close }
                                                           annotation={ annotation }/> }
  </Fragment>
}
