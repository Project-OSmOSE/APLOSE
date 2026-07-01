import React, { Fragment, useCallback } from 'react';
import type { AcousticFeaturesProps } from './props';
import styles from './styles.module.scss';
import { Checkbox, Field } from '@/components/base';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/Annotation';

export const Checks: React.FC<AcousticFeaturesProps> = ({ annotation }) => {

    const updateFeatures = useUpdateAnnotationFeatures()

    const onIntensityTooLowChange = useCallback((isIntensityTooLow: boolean) => {
        updateFeatures(annotation, { isIntensityTooLow })
    }, [ updateFeatures, annotation ])

    const onOverlapSignalChange = useCallback((doesOverlapOtherSignals: boolean) => {
        updateFeatures(annotation, { doesOverlapOtherSignals })
    }, [ updateFeatures, annotation ])

    return <Fragment>
        <Field.Root horizontal className={ styles.line }>
            <Field.Label>Intensity is too low</Field.Label>
            <Checkbox checked={ annotation.acousticFeatures?.isIntensityTooLow ?? undefined }
                      onCheckedChange={ onIntensityTooLowChange }/>
        </Field.Root>

        <Field.Root horizontal className={ styles.line }>
            <Field.Label>Overlap other signal</Field.Label>
            <Checkbox checked={ annotation.acousticFeatures?.doesOverlapOtherSignals ?? undefined }
                      onCheckedChange={ onOverlapSignalChange }/>
        </Field.Root>
    </Fragment>
}