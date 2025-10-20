import React, { Fragment, useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { IoChevronForwardOutline, IoTimeOutline } from 'react-icons/io5';
import { AnnotationType } from '@/api';
import { formatTime } from '@/service/function';

export const AnnotationTimeInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

  const correctedStartTime = useMemo(() => {
    if (annotation.update && annotation.update?.start_time !== annotation.start_time) return annotation.update.start_time;
    return undefined
  }, [ annotation ])

  const correctedEndTime = useMemo(() => {
    if (annotation.update && annotation.update?.end_time !== annotation.end_time) return annotation.update.end_time;
    return undefined
  }, [ annotation ])

  const isCorrected = useMemo(() => correctedStartTime || correctedEndTime, [ correctedStartTime, correctedEndTime ])

  return <div className={ styles.info }>
    <IoTimeOutline className={ styles.mainIcon }/>

    <p className={ isCorrected ? 'disabled' : undefined }>
      { formatTime(annotation.start_time!, true) }
      { annotation.type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { formatTime(annotation.end_time!, true) }
      </Fragment> }
    </p>

    { isCorrected && <p>
      { formatTime(correctedStartTime ?? annotation.start_time!, true) }
      { annotation.type === AnnotationType.Box && <Fragment>
          &nbsp;<IoChevronForwardOutline/> { formatTime(correctedEndTime ?? annotation.end_time!, true) }
      </Fragment> }
    </p> }
  </div>
}
