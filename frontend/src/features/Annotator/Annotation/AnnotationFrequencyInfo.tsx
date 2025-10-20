import React, { Fragment, useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { IoAnalyticsOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { AnnotationType } from '@/api';

export const AnnotationFrequencyInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

  const correctedStartFrequency = useMemo(() => {
    if (annotation.update && annotation.update?.start_frequency !== annotation.start_frequency) return annotation.update.start_frequency;
    return undefined
  }, [ annotation ])

  const correctedEndFrequency = useMemo(() => {
    if (annotation.update && annotation.update?.end_frequency !== annotation.end_frequency) return annotation.update.end_frequency;
    return undefined
  }, [ annotation ])

  const isCorrected = useMemo(() => correctedStartFrequency || correctedEndFrequency, [ correctedStartFrequency, correctedEndFrequency ])

  return <div className={ styles.info }>
    <IoAnalyticsOutline className={ styles.mainIcon }/>

    <p className={ isCorrected ? 'disabled' : undefined }>
      { annotation.start_frequency!.toFixed(2) }Hz
      { annotation.type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { annotation.end_frequency!.toFixed(2) }Hz
      </Fragment> }
    </p>

    { isCorrected && <p>
      { (correctedStartFrequency ?? annotation.start_frequency!).toFixed(2) }Hz
      { annotation.type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { (correctedEndFrequency ?? annotation.end_frequency!).toFixed(2) }Hz
      </Fragment> }
    </p> }
  </div>
}
