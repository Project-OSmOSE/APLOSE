import React from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { PlusMinus } from '@solar-icons/react';

export const AnnotationConfidenceInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    return <div className={ styles.info }>
        <PlusMinus weight="Linear" size={ 20 } className={ styles.mainIcon }/>
        <span>{ annotation.confidence ?? '-' }</span>
    </div>
}
