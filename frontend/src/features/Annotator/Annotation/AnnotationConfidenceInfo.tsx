import React from 'react';
import { PlusMinusLinearIcon } from '@solar-icons/react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';

export const AnnotationConfidenceInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
    return <div className={ styles.info }>
        <PlusMinusLinearIcon size={ 20 } className={ styles.mainIcon }/>
        <span>{ annotation.confidence ?? '-' }</span>
    </div>
}
