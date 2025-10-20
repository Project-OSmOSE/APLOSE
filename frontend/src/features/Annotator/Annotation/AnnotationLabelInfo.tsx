import React, { useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { IoPricetagOutline } from 'react-icons/io5';
import { AnnotationType } from '@/api';

export const AnnotationLabelInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

  const correctedLabel = useMemo(() => {
    if (annotation.update?.label !== annotation.label) return annotation.label;
    return undefined
  }, [ annotation ])

  return <div className={ styles.info }>
    <IoPricetagOutline className={ styles.mainIcon }/>

    <p className={ correctedLabel ? 'disabled' : undefined }>
      { annotation.label }
      <span>{ annotation.type === AnnotationType.Weak ? ` (Weak)` : '' }</span>
    </p>

    { correctedLabel && <p>{ correctedLabel }</p> }
  </div>
}
