import React, { Fragment, useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { IoChevronForwardOutline, IoTimeOutline } from 'react-icons/io5';
import { AnnotationType } from '@/api';
import { formatTime } from '@/service/function';

export const AnnotationTimeInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

  const correctedStartTime = useMemo(() => {
    if (annotation.update?.startTime !== annotation.startTime) return annotation.update?.startTime;
    return undefined
  }, [ annotation ])

  const correctedEndTime = useMemo(() => {
    if (annotation.update?.endTime !== annotation.endTime) return annotation.update?.endTime;
    return undefined
  }, [ annotation ])

  const isCorrected = useMemo(() => correctedStartTime || correctedEndTime, [ correctedStartTime, correctedEndTime ])

  return <div className={ styles.info }>
    <IoTimeOutline className={ styles.mainIcon }/>

    <p className={ isCorrected ? 'disabled' : undefined }>
      { formatTime(annotation.startTime!, true) }
      { annotation.type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { formatTime(annotation.endTime!, true) }
      </Fragment> }
    </p>

    { isCorrected && <p>
      { formatTime(correctedStartTime ?? annotation.startTime!, true) }
      { annotation.type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { formatTime(correctedEndTime ?? annotation.endTime!, true) }
      </Fragment> }
    </p> }
  </div>
}
