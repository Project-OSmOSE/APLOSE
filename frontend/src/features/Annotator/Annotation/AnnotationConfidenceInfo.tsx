import React from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { FaHandshake } from 'react-icons/fa6';

export const AnnotationConfidenceInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {
  return <div className={ styles.info }>
    <FaHandshake className={ styles.mainIcon }/>
    <p>{ annotation.confidence ?? '-' }</p>
  </div>
}
