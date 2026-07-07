import React, { useCallback } from 'react';
import { type Annotation, type Features } from '@/features/Annotator/Annotation';
import { Td, Th, Tr } from '@/components/ui';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/AcousticFeatures/hooks';
import { SignalTrendType } from '@/api';
import { Select } from '@/components/base';

export const Trend: React.FC<{ annotation: Annotation }> = ({ annotation }) => {

    const updateFeatures = useUpdateAnnotationFeatures()
    const onTrendUpdate = useCallback((value: SignalTrendType | null) => {
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
        <Th scope="row">Trend</Th>
        <Td colSpan={ 2 }>
            <Select items={ Object.values(SignalTrendType) }
                    itemName="trend"
                    itemToStringValue={ item => SignalTrendType[item] }
                    itemToElementLabel={ item => SignalTrendType[item] }
                    value={ annotation.acousticFeatures?.trend ?? undefined }
                    onValueChange={ onTrendUpdate }/>
        </Td>
    </Tr>
}