import React, { Fragment, useMemo } from 'react';
import { AltArrowRightLinearIcon, CourseUpLinearIcon } from '@solar-icons/react';
import type { Annotation } from './slice';
import styles from './styles.module.scss';
import { AnnotationType } from '@/api';
import { NBSP } from '@/service/type';

export const AnnotationFrequencyInfo: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

    const correctedStartFrequency = useMemo(() => {
        if (annotation.update?.minFrequency !== annotation.minFrequency) return annotation.update?.minFrequency;
        return undefined
    }, [ annotation ])

    const correctedEndFrequency = useMemo(() => {
        if (annotation.update?.maxFrequency !== annotation.maxFrequency) return annotation.update?.maxFrequency;
        return undefined
    }, [ annotation ])

    const isCorrected = useMemo(() => correctedStartFrequency || correctedEndFrequency, [ correctedStartFrequency, correctedEndFrequency ])

    if (annotation.type === AnnotationType.Weak) return <Fragment/>
    return <div className={ styles.info }>
        <CourseUpLinearIcon size={ 20 } className={ styles.mainIcon }/>

        <span className={ isCorrected ? 'disabled' : undefined }>
      { annotation.minFrequency!.toFixed(2) }Hz
            { annotation.type === AnnotationType.Box && <Fragment>
                { NBSP }<AltArrowRightLinearIcon size={ 16 }/> { annotation.maxFrequency!.toFixed(2) }Hz
            </Fragment> }
    </span>

        { isCorrected && <span>
      { (correctedStartFrequency ?? annotation.minFrequency!).toFixed(2) }Hz
            { annotation.type === AnnotationType.Box && <Fragment>
                { NBSP }<AltArrowRightLinearIcon
                                       size={ 16 }/> { (correctedEndFrequency ?? annotation.maxFrequency!).toFixed(2) }Hz
            </Fragment> }
    </span> }
    </div>
}
