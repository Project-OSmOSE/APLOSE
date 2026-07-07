import React, { Fragment, useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { AnnotationType } from '@/api';
import { formatTime } from '@/service/function';
import { NBSP } from '@/service/type';
import { AltArrowRight, ClockCircle } from '@solar-icons/react';

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
        <ClockCircle weight="Linear" size={ 20 } className={ styles.mainIcon }/>

        <span className={ isCorrected ? 'disabled' : undefined }>
      { formatTime(annotation.startTime!, true) }
            { annotation.type === AnnotationType.Box && <Fragment>
                { NBSP }<AltArrowRight weight="Linear" size={ 16 }/> { formatTime(annotation.endTime!, true) }
            </Fragment> }
    </span>

        { isCorrected && <span>
      { formatTime(correctedStartTime ?? annotation.startTime!, true) }
            { annotation.type === AnnotationType.Box && <Fragment>
                { NBSP }<AltArrowRight weight="Linear"
                                       size={ 16 }/> { formatTime(correctedEndTime ?? annotation.endTime!, true) }
            </Fragment> }
    </span> }
    </div>
}
