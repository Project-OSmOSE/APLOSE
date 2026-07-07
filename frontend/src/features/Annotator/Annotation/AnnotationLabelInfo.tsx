import React, { useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { AnnotationType } from '@/api';
import { Tag } from '@solar-icons/react';

export const AnnotationLabelInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

    const correctedLabel = useMemo(() => {
        if (annotation.update?.label !== annotation.label) return annotation.update?.label;
        return undefined
    }, [ annotation ])

    return <div className={ styles.info }>
        <Tag weight="Linear" size={ 20 } className={ styles.mainIcon }/>

        <span className={ correctedLabel ? 'disabled' : undefined }>
      { annotation.label }
            <span>{ annotation.type === AnnotationType.Weak ? ` (Weak)` : '' }</span>
    </span>

        { correctedLabel && <p>{ correctedLabel }</p> }
    </div>
}
