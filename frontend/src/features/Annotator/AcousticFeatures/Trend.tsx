import React, { useCallback } from 'react';
import { type Annotation, type Features } from '@/features/Annotator/Annotation';
import { Td, Th, Tr } from '@/components/ui';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/AcousticFeatures/hooks';
import { SignalTrendType } from '@/api';
import { type Item, Select } from '@/components/form';

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

    return <Tr>
            <Th scope='row'>Trend</Th>
            <Td colSpan={2}>
                <Select options={ Object.values(SignalTrendType).map(value => ({ label: value, value } as Item)) }
                        placeholder="Select a value"
                        optionsContainer="popover"
                        value={ annotation.acousticFeatures!.trend ?? undefined }
                        onValueSelected={ value => onTrendUpdate(value as SignalTrendType) }/>
            </Td>
        </Tr>
}