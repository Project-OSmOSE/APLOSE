import React, { Fragment, useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { IoAnalyticsOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { AnnotationType } from '@/api';
import { NBSP } from '@/service/type';

export const AnnotationFrequencyInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

  const correctedStartFrequency = useMemo(() => {
    if (annotation.update?.startFrequency !== annotation.startFrequency) return annotation.update?.startFrequency;
    return undefined
  }, [ annotation ])

  const correctedEndFrequency = useMemo(() => {
    if (annotation.update?.endFrequency !== annotation.endFrequency) return annotation.update?.endFrequency;
    return undefined
  }, [ annotation ])

  const isCorrected = useMemo(() => correctedStartFrequency || correctedEndFrequency, [ correctedStartFrequency, correctedEndFrequency ])

  if (annotation.type === AnnotationType.Weak) return <Fragment/>
  return <div className={ styles.info }>
    <IoAnalyticsOutline className={ styles.mainIcon }/>

    <p className={ isCorrected ? 'disabled' : undefined }>
      { annotation.startFrequency!.toFixed(2) }Hz
      { annotation.type === AnnotationType.Box && <Fragment>
        { NBSP }<IoChevronForwardOutline/> { annotation.endFrequency!.toFixed(2) }Hz
      </Fragment> }
    </p>

    { isCorrected && <p>
      { (correctedStartFrequency ?? annotation.startFrequency!).toFixed(2) }Hz
      { annotation.type === AnnotationType.Box && <Fragment>
        { NBSP }<IoChevronForwardOutline/> { (correctedEndFrequency ?? annotation.endFrequency!).toFixed(2) }Hz
      </Fragment> }
    </p> }
  </div>
}
