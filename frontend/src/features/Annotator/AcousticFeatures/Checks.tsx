import React, { Fragment, useCallback } from 'react';
import type { AcousticFeaturesProps } from './props';
import styles from './styles.module.scss';
import { type Features, useUpdateAnnotationFeatures } from '@/features/Annotator/Annotation';
import { IonCheckbox } from '@ionic/react';

export const Checks: React.FC<AcousticFeaturesProps> = ({ annotation }) => {

    const updateFeatures = useUpdateAnnotationFeatures()
    const onFeatureToggle = useCallback((field: keyof Features) => {
        updateFeatures(annotation, { [field]: !annotation.acousticFeatures![field] })
    }, [ updateFeatures, annotation ])

    return <Fragment>
        <div className={ styles.line }>
            <p>Intensity is too low</p>
            <IonCheckbox checked={ annotation.acousticFeatures!.isIntensityTooLow ?? undefined }
                         onClick={ () => onFeatureToggle('isIntensityTooLow') }/>
        </div>
        <div className={ styles.line }>
            <p>Overlap other signal</p>
            <IonCheckbox checked={ annotation.acousticFeatures!.doesOverlapOtherSignals ?? undefined }
                         onClick={ () => onFeatureToggle('doesOverlapOtherSignals') }/>
        </div>
    </Fragment>
}