import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';
import { type Annotation, focusAnnotation } from './slice';
import { Td, Th, Tr } from '@/components/ui';
import styles from './styles.module.scss';
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import { AnnotationPhaseType, AnnotationType } from '@/api';
import { useInvalidateAnnotation, useUpdateAnnotation, useValidateAnnotation } from './hooks';
import { useFocusCanvasOnTime } from '@/features/Annotator/Canvas';
import { AnnotationTimeInfo } from './AnnotationTimeInfo';
import { AnnotationFrequencyInfo } from './AnnotationFrequencyInfo';
import { AnnotationConfidenceInfo } from '@/features/Annotator/Annotation/AnnotationConfidenceInfo';
import { RiRobot2Fill, RiUser3Fill } from 'react-icons/ri';
import { InvalidateAnnotationModal } from '@/features/Annotator/Annotation/InvalidateAnnotationModal';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';
import { useLoaderData } from '@tanstack/react-router';
import { ChatLine, ChatSquare, CheckCircle, CloseCircle } from '@solar-icons/react';
import { Button, Dialog } from '@/components/base';
import { LabelDialog } from '@/features/Labels';
import type { LabelFragment } from '@/features/Labels/api';

export const AnnotationRow: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { campaign, labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const { annotations } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const validate = useValidateAnnotation()
    const invalidate = useInvalidateAnnotation()
    const focusTime = useFocusCanvasOnTime()
    const { user } = useLoaderData({ from: '/_authenticated' })

    const updateAnnotation = useUpdateAnnotation()
    const updateLabel = useCallback((label: LabelFragment) => {
        if (!annotation) return;
        updateAnnotation(annotation, { label: label.name })
    }, [ annotation, updateAnnotation ]);
    const dispatch = useAppDispatch();

    const completeInfo = useMemo(() => {
        if (annotation.annotationPhase == phase?.id) {
            return { annotator: user, detectorConfiguration: undefined }
        }
        return annotations?.find(a => a.id === annotation.id.toString())
    }, [ annotations, annotation, user, phase ])

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
    }, [ annotation, validate ]);

    const onInvalidate = useCallback((event: MouseEvent) => {
        event.stopPropagation()
        invalidate(annotation)
    }, [ annotation, invalidate ]);

    const [ isLabelModalOpen, setIsLabelModalOpen ] = useState<boolean>(false);
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
        { campaign.confidenceSet && <Td><AnnotationConfidenceInfo annotation={ annotation }/></Td> }

        {/* Detector | Annotator */ }
        { phase.phase === AnnotationPhaseType.Verification && (
            completeInfo?.detectorConfiguration ?
                <Td>
                    <div className={ styles.horizontal }>
                        <RiRobot2Fill/>
                        <p>{ completeInfo?.detectorConfiguration.detector.name }</p>
                    </div>
                </Td>
                :
                <Td className={ completeInfo?.annotator?.id === user.id ? 'disabled' : '' }>
                    <div className={ styles.horizontal }>
                        <RiUser3Fill/>
                        <p>{ completeInfo?.annotator?.displayName } { completeInfo?.annotator?.id === user.id ? '(self)' : '' }</p>
                    </div>
                </Td>
        ) }

        {/* Comments */ }
        <Td>
            { annotation.comments && annotation.comments.length > 0 ?
                <ChatLine weight="Bold" size={ 20 }/> :
                <ChatSquare weight="Linear" size={ 20 }/> }
        </Td>

        {/* Validation */ }
        { phase.phase === AnnotationPhaseType.Verification &&
            <Td>
                <div className={ styles.horizontal }>
                    { completeInfo?.annotator?.id !== user.id ? <Fragment>
                        <Button data-testid="validate"
                                color={ annotation.validation?.isValid ? 'success' : 'medium' }
                                onClick={ onValidate }>
                            <CheckCircle weight={ annotation.validation?.isValid ? 'BoldDuotone' : 'LineDuotone' }
                                         size={ 20 }/>
                        </Button>
                        { annotation.type === 'Weak' ? <Button data-testid="invalidate"
                                                               color={ annotation.validation?.isValid ? 'medium' : 'danger' }
                                                               onClick={ onInvalidate }>
                            <CloseCircle weight={ annotation.validation?.isValid ? 'LineDuotone' : 'BoldDuotone' }
                                         size={ 20 }/>
                        </Button> : <Dialog.Root>
                            <Dialog.Trigger data-testid="invalidate"
                                            color={ annotation.validation?.isValid ? 'medium' : 'danger' }>
                                <CloseCircle weight={ annotation.validation?.isValid ? 'LineDuotone' : 'BoldDuotone' }
                                             size={ 20 }/>
                            </Dialog.Trigger>
                            <Dialog.Portal>
                                <InvalidateAnnotationModal annotation={ annotation }
                                                           onAskLabelChange={ () => setIsLabelModalOpen(true) }/>
                            </Dialog.Portal>
                        </Dialog.Root> }
                    </Fragment> : <Fragment/> }
                </div>
            </Td> }

        <Dialog.Root open={ isLabelModalOpen } onOpenChange={ setIsLabelModalOpen }>
            <Dialog.Portal>
                <LabelDialog.Update availableLabels={ labels }
                                    selected={ labels.find(l => l.name === annotation.label) }
                                    onSelect={ updateLabel }/>
            </Dialog.Portal>
        </Dialog.Root>
    </Tr>
}
