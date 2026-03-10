import React, { Fragment, MouseEvent, useCallback, useMemo } from 'react';
import { type Annotation, focusAnnotation } from './slice';
import { Td, Th, Tr, useModal } from '@/components/ui';
import styles from './styles.module.scss';
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import {
    AnnotationPhaseType,
    AnnotationType,
    type GetAnnotationTaskQuery,
    useAnnotationTask,
    useCurrentCampaign,
    useCurrentPhase,
    useCurrentUser,
} from '@/api';
import {
    useGetAnnotations,
    useInvalidateAnnotation,
    useRemoveAnnotation,
    useUpdateAnnotation,
    useValidateAnnotation,
} from './hooks';
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
import { UpdateLabelModal } from '@/features/Annotator/Label/UpdateLabelModal';

type Spectro = NonNullable<GetAnnotationTaskQuery['annotationSpectrogramById']>
type Task = NonNullable<Spectro['task']>
type CompleteInfo = Pick<NonNullable<NonNullable<Task['userAnnotations']>['results'][number]>, 'detectorConfiguration' | 'annotator'>

export const AnnotationRow: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { phaseType } = useParams<AploseNavParams>();
    const { campaign } = useCurrentCampaign()
    const { phase } = useCurrentPhase()
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const getAnnotations = useGetAnnotations()
    const validate = useValidateAnnotation()
    const invalidate = useInvalidateAnnotation()
    const removeAnnotation = useRemoveAnnotation()
    const { annotations } = useAnnotationTask()
    const focusTime = useFocusCanvasOnTime()
    const { user } = useCurrentUser()

    const updateAnnotation = useUpdateAnnotation()
    const updateLabel = useCallback((label: string) => {
        if (!annotation) return;
        updateAnnotation(annotation, { label })
    }, [ annotation, updateAnnotation ]);
    const labelModal = useModal(UpdateLabelModal, {
        selected: annotation.label,
        onUpdate: updateLabel,
    })
    const invalidateModal = useModal(InvalidateAnnotationModal, {
        annotation,
        onAskLabelChange: labelModal.open,
    })
    const dispatch = useAppDispatch();

    const completeInfo: CompleteInfo | undefined = useMemo(() => {
        if (annotation.annotationPhase == phase?.id) {
            return { annotator: user }
        }
        return annotations?.find(a => a.id === annotation.id.toString())
    }, [ annotations, annotation, user, phase ])

    const isActive = useMemo(() => annotation.id === focusedAnnotation?.id ? styles.active : undefined, [ annotation, focusedAnnotation ])

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

    return <Tr className={ annotation.id !== focusedAnnotation?.id ? 'disabled' : '' } onClick={ onClick }>

        {/* Label */ }
        <Th scope="row"
            colSpan={ annotation.type === AnnotationType.Weak ? 3 : 1 }>
            <AnnotationLabelInfo annotation={ annotation }/>
        </Th>

        {/* Time & Frequency */ }
        { annotation.type !== AnnotationType.Weak && <Fragment>
            <Td><AnnotationTimeInfo annotation={ annotation }/></Td>
            <Td><AnnotationFrequencyInfo annotation={ annotation }/></Td>
        </Fragment> }

        {/* Confidence */ }
        { campaign?.confidenceSet && <Td><AnnotationConfidenceInfo annotation={ annotation }/></Td> }

        {/* Detector | Annotator */ }
        { phaseType === AnnotationPhaseType.Verification && (
            completeInfo?.detectorConfiguration ?
                <Td>
                    <RiRobot2Fill/>
                    <p>{ completeInfo?.detectorConfiguration.detector.name }</p>
                </Td>
                :
                <Td className={ completeInfo?.annotator?.id === user?.id ? 'disabled' : '' }>
                    <RiUser3Fill/>
                    <p>{ completeInfo?.annotator?.displayName } { completeInfo?.annotator?.id === user?.id ? '(self)' : '' }</p>
                </Td>
        ) }

        {/* Comments */ }
        <Td>
            { annotation.comments && annotation.comments.length > 0 ? <IoChatbubbleEllipses/> : <IoChatbubbleOutline/> }
        </Td>

        {/* Validation */ }
        { phaseType === AnnotationPhaseType.Verification &&
            <Td>
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
            </Td> }

        { invalidateModal.element }
        { labelModal.element }
    </Tr>
}
