import React, { useMemo } from 'react';
import { TagLinearIcon } from '@solar-icons/react';
import { useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnnotationType } from '@/api/types.gql-generated.ts';
import { Campaign } from "@/features";
import type { Annotation } from './slice';
import styles from './styles.module.scss';

export const AnnotationLabelInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const { data: labels } = useQuery(Campaign.labelsByIdQuery({ id: campaignID }))

    const correctedLabel = useMemo(() => {
        if (annotation.update?.labelId !== annotation.labelId) return labels?.find(l => l.label.id === annotation.update?.labelId);
        return undefined
    }, [ labels, annotation ])

    const baseLabel = useMemo(() => {
        return labels?.find(l => l.label.id === annotation.labelId);
    }, [ labels, annotation ])

    return <div className={ styles.info }>
        <TagLinearIcon size={ 20 } className={ styles.mainIcon }/>

        <span className={ correctedLabel ? 'disabled' : undefined }>
      { baseLabel?.label.preferredDisplay }
            <span>{ annotation.type === AnnotationType.Weak ? ` (Weak)` : '' }</span>
    </span>

        { correctedLabel && <p>{ correctedLabel.label.preferredDisplay }</p> }
    </div>
}
