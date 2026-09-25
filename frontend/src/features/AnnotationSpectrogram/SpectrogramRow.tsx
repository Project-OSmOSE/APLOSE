import React, { Fragment, useMemo } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { AltArrowRightLinearIcon, CheckCircleBoldIcon, RecordLinearIcon } from '@solar-icons/react';
import {
    AnnotationNodeNodeConnection,
    AnnotationPhaseType,
    type AnnotationSpectrogramNode,
    AnnotationTaskNode,
    AnnotationTaskStatus,
    type Maybe,
} from '@/api/types.gql-generated.ts';
import { Td, Th, Tr } from '@/components/ui';
import { Link } from '@/components/base';
import { useOpenAnnotatorParams } from '@/features/Annotator/Navigation';
import { formatTime } from '@/service/function';
import styles from './styles.module.scss'

export const SpectrogramRow: React.FC<{
    spectrogram: Pick<AnnotationSpectrogramNode, 'id' | 'filename' | 'duration' | 'start' | 'isAssigned'>,
    task?: Maybe<Pick<AnnotationTaskNode, 'status'>>,
    userAnnotations?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
    annotationsToCheck?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
    validAnnotationsToCheck?: Maybe<Pick<AnnotationNodeNodeConnection, 'totalCount'>>;
}> = ({ spectrogram, task, userAnnotations, annotationsToCheck, validAnnotationsToCheck }) => {
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/_detailLayout/phase/$phaseType' })
    const openAnnotatorParams = useOpenAnnotatorParams(spectrogram.id)

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
                { submitted && <CheckCircleBoldIcon size={ 16 } className={ styles.iconPrimary }/> }
                { !submitted && <RecordLinearIcon size={ 16 } className={ styles.iconMedium }/> }
            </Fragment> : '-' }
        </Td>
        <Td>
            <Link color="primary"
                  data-testid="access-button"
                  { ...openAnnotatorParams }>
                <AltArrowRightLinearIcon size={ 24 }/>
            </Link>
        </Td>
    </Tr>
}