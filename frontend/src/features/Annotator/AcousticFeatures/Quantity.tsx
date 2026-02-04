import React, { useCallback } from 'react';
import type { AcousticFeaturesProps } from './props';
import { useRemoveAnnotationFeatures } from './hooks';
import styles from './styles.module.scss';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/Annotation';

export const QuantitySwitch: React.FC<AcousticFeaturesProps> = ({ annotation }) => {
    const updateFeatures = useUpdateAnnotationFeatures()
    const removeFeatures = useRemoveAnnotationFeatures()

    const setMultiple = useCallback(() => {
        removeFeatures(annotation)
    }, [ annotation, removeFeatures ])

    const setSingle = useCallback(() => {
        if (annotation.acousticFeatures) return;
        updateFeatures(annotation, {})
    }, [ annotation, updateFeatures ])

    return <div className={ styles.line }>
        <b>Quantity</b>
        <div className={ styles.switch }>
            <div className={ !annotation?.acousticFeatures ? styles.active : undefined } onClick={ setMultiple }>
                Multiple
            </div>
            <div className={ annotation?.acousticFeatures ? styles.active : undefined } onClick={ setSingle }>
                Single
            </div>
        </div>
    </div>
}