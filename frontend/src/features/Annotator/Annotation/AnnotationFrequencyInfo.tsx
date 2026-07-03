import React, { Fragment, useMemo } from 'react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { AnnotationType } from '@/api';
import { NBSP } from '@/service/type';
import { AltArrowRight, CourseUp } from '@solar-icons/react';

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
        <CourseUp weight="Linear" size={ 20 } className={ styles.mainIcon }/>

        <span className={ isCorrected ? 'disabled' : undefined }>
      { annotation.startFrequency!.toFixed(2) }Hz
            { annotation.type === AnnotationType.Box && <Fragment>
                { NBSP }<AltArrowRight weight="Linear" size={ 16 }/> { annotation.endFrequency!.toFixed(2) }Hz
            </Fragment> }
    </span>

        { isCorrected && <span>
      { (correctedStartFrequency ?? annotation.startFrequency!).toFixed(2) }Hz
            { annotation.type === AnnotationType.Box && <Fragment>
                { NBSP }<AltArrowRight weight="Linear"
                                       size={ 16 }/> { (correctedEndFrequency ?? annotation.endFrequency!).toFixed(2) }Hz
            </Fragment> }
    </span> }
    </div>
}
