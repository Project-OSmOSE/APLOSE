import {
    AnnotationNodeNodeConnection,
    AnnotationPhaseType,
    type AnnotationSpectrogramNode,
    AnnotationTaskNode,
    AnnotationTaskStatus,
    type Maybe,
} from '@/api';
import React, { Fragment, useMemo } from 'react';
import { Td, Th, Tr } from '@/components/ui';
import { useOpenAnnotator } from '@/features/Annotator/Navigation';
import { formatTime } from '@/service/function';
import styles from './styles.module.scss'
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@/components/base/Button';
import { AltArrowRight, CheckCircle, Record } from '@solar-icons/react';

export const SpectrogramRow: React.FC<{
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'duration' | 'start' | 'isAssigned'>,
    task?: Maybe<Pick<AnnotationTaskNode, 'status'>>,
    userAnnotations?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
    annotationsToCheck?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
    validAnnotationsToCheck?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
}> = ({ spectrogram, task, userAnnotations, annotationsToCheck, validAnnotationsToCheck }) => {
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
    const openAnnotator = useOpenAnnotator()

    const submitted = useMemo(() => task?.status === AnnotationTaskStatus.Finished, [ task ])
    const start = useMemo(() => new Date(spectrogram.start), [ spectrogram ])

    const allAnnotationsCount = useMemo(() => {
        switch (phase?.phase) {
            case AnnotationPhaseType.Annotation:
                return (userAnnotations?.totalCount ?? 0)
            case AnnotationPhaseType.Verification:
                return (annotationsToCheck?.totalCount ?? 0)
        }
    }, [ phase, userAnnotations, annotationsToCheck ])

    const validAnnotationsCount = useMemo(() => {
        return (userAnnotations?.totalCount ?? 0) + (validAnnotationsToCheck?.totalCount ?? 0)
    }, [ userAnnotations, validAnnotationsToCheck ])

    return <Tr className={ submitted ? styles.submitted : '' }>
        <Th scope="row">{ spectrogram.filename }</Th>
        <Td center>{ start.toUTCString() }</Td>
        <Td center>{ formatTime(spectrogram.duration) }</Td>
        <Td center>{ spectrogram.isAssigned ? allAnnotationsCount : '-' }</Td>
        { phase?.phase == 'Verification' && <Td center>{ spectrogram.isAssigned ? validAnnotationsCount : '-' }</Td> }
        <Td center>
            { spectrogram.isAssigned ? <Fragment>
                { submitted &&
                    <CheckCircle weight="Bold" size={ 16 } className={ styles.iconPrimary }/> }
                { !submitted &&
                    <Record weight="Linear" size={ 16 } className={ styles.iconMedium }/> }
            </Fragment> : '-' }
        </Td>
        <Td>
            <Button color="primary"
                    data-testid="access-button"
                    onClick={ () => openAnnotator(spectrogram.id) }>
                <AltArrowRight weight="Linear" size={ 24 }/>
            </Button>
        </Td>
    </Tr>
}