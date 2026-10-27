import React, { useMemo } from 'react';
import { TagLinearIcon } from '@solar-icons/react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { AnnotationType } from '@/api';
import { useLoaderData } from "@tanstack/react-router";

export const AnnotationLabelInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    const correctedLabel = useMemo(() => {
        if (annotation.update?.labelId !== annotation.labelId) return labels.find(l => l.id === annotation.update?.labelId);
        return undefined
    }, [ labels, annotation ])

    const baseLabel = useMemo(() => {
        return labels.find(l => l.id === annotation.labelId);
    }, [ labels, annotation ])

    return <div className={ styles.info }>
        <TagLinearIcon size={ 20 } className={ styles.mainIcon }/>

        <span className={ correctedLabel ? 'disabled' : undefined }>
      { baseLabel?.displayName }
            <span>{ annotation.type === AnnotationType.Weak ? ` (Weak)` : '' }</span>
    </span>

        { correctedLabel && <p>{ correctedLabel.displayName }</p> }
    </div>
}
