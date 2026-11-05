import React, { Fragment, MouseEvent, useCallback, useMemo, useState } from 'react';
import { RiRobot2Fill, RiUser3Fill } from 'react-icons/ri';
import { useLoaderData, useParams } from '@tanstack/react-router';
import {
    ChatSquareLinearIcon,
    ChatSquareLineBoldIcon,
    CheckCircleBoldDuotoneIcon,
    CheckCircleLineDuotoneIcon,
    CloseCircleBoldDuotoneIcon,
    CloseCircleLineDuotoneIcon,
} from '@solar-icons/react';
import { useQuery } from "@tanstack/react-query";
import { Td, Th, Tr } from '@/components/ui';
import { Button, Dialog } from '@/components/base';
import { AnnotationPhaseType, AnnotationType } from '@/api/types.gql-generated.ts';
import { useFocusCanvasOnTime } from '@/features/Annotator/Canvas';
import { AnnotationConfidenceInfo } from '@/features/Annotator/Annotation/AnnotationConfidenceInfo';
import { InvalidateAnnotationModal } from '@/features/Annotator/Annotation/InvalidateAnnotationModal';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectAnnotation } from '@/features/Annotator/Annotation/selectors';
import { Campaign } from "@/features";
import { useInvalidateAnnotation, useUpdateAnnotation, useValidateAnnotation } from './hooks';
import { AnnotationFrequencyInfo } from './AnnotationFrequencyInfo';
import { AnnotationTimeInfo } from './AnnotationTimeInfo';
import { AnnotationLabelInfo } from './AnnotationLabelInfo';
import { type Annotation, focusAnnotation } from './slice';
import styles from './styles.module.scss';
import { MxOntology } from "@/features/Mx";

export const AnnotationRow: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { data: labels } = useQuery(Campaign.labelsByIdQuery({ id: campaignID }))
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const { annotations } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const focusedAnnotation = useAppSelector(selectAnnotation)
    const validate = useValidateAnnotation()
    const invalidate = useInvalidateAnnotation()
    const focusTime = useFocusCanvasOnTime()
    const { user } = useLoaderData({ from: '/_authenticated' })

    const updateAnnotation = useUpdateAnnotation()
    const updateLabel = useCallback((labelId: string) => {
        if (!annotation) return;
        updateAnnotation(annotation, { labelId })
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
            { annotation.comments && annotation.comments.length > 0
                ? <ChatSquareLineBoldIcon size={ 20 }/>
                : <ChatSquareLinearIcon size={ 20 }/> }
        </Td>

        {/* Validation */ }
        { phase.phase === AnnotationPhaseType.Verification &&
            <Td>
                <div className={ styles.horizontal }>
                    { completeInfo?.annotator?.id !== user.id ? <Fragment>
                        <Button data-testid="validate"
                                color={ annotation.validation?.isValid ? 'success' : 'medium' }
                                onClick={ onValidate }>
                            { annotation.validation?.isValid
                                ? <CheckCircleBoldDuotoneIcon size={ 20 }/>
                                : <CheckCircleLineDuotoneIcon size={ 20 }/> }
                        </Button>
                        { annotation.type === 'Weak' ? <Button data-testid="invalidate"
                                                               color={ annotation.validation?.isValid ? 'medium' : 'danger' }
                                                               onClick={ onInvalidate }>
                            { annotation.validation?.isValid
                                ? <CloseCircleLineDuotoneIcon size={ 20 }/>
                                : <CloseCircleBoldDuotoneIcon size={ 20 }/> }
                        </Button> : <Dialog.Root>
                            <Dialog.Trigger data-testid="invalidate"
                                            color={ annotation.validation?.isValid ? 'medium' : 'danger' }>
                                { annotation.validation?.isValid
                                    ? <CloseCircleLineDuotoneIcon size={ 20 }/>
                                    : <CloseCircleBoldDuotoneIcon size={ 20 }/> }
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
                <MxOntology.UpdateLabelDialogContent availableLabels={ labels?.map(l => l.label) ?? [] }
                                                     selectedID={ annotation.labelId }
                                                     onSelectID={ updateLabel }/>
            </Dialog.Portal>
        </Dialog.Root>
    </Tr>
}
