import React, { Fragment, useCallback } from 'react';
import { type Annotation, type Features } from '@/features/Annotator/Annotation';
import { TableContent, TableDivider } from '@/components/ui';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/AcousticFeatures/hooks';
import { SignalTrendType } from '@/api';
import { type Item, Select } from '@/components/form';
import styles from './styles.module.scss';

export const Trend: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

    const updateFeatures = useUpdateAnnotationFeatures()
    const onTrendUpdate = useCallback((value: SignalTrendType) => {
        const update: Partial<Features> = { trend: value };
        if (!annotation?.acousticFeatures?.startFrequency
            && !annotation?.acousticFeatures?.endFrequency) {
            switch (value) {
                case SignalTrendType.Ascending:
                    update.startFrequency = annotation.startFrequency
                    update.endFrequency = annotation.endFrequency
                    break;
                case SignalTrendType.Descending:
                    update.startFrequency = annotation.endFrequency
                    update.endFrequency = annotation.startFrequency
                    break;
            }
        }
        updateFeatures(annotation, update)
    }, [ updateFeatures, annotation ])

    return <Fragment>
        <TableContent isFirstColumn>Trend</TableContent>
        <TableContent className={ styles.span2ColsEnd }>
            <Select options={ Object.values(SignalTrendType).map(value => ({ label: value, value } as Item)) }
                    placeholder="Select a value"
                    optionsContainer="popover"
                    value={ annotation.acousticFeatures!.trend ?? undefined }
                    onValueSelected={ value => onTrendUpdate(value as SignalTrendType) }/>
        </TableContent>
        <TableDivider/>
    </Fragment>
}