import React, { useCallback, useState } from 'react';
import type { AcousticFeaturesProps } from './props';
import { useRemoveAnnotationFeatures } from './hooks';
import { useUpdateAnnotationFeatures } from '@/features/Annotator/Annotation';
import { Field, Toggle } from '@/components/base';

type Quantity = 'single' | 'multiple'
export const QuantitySwitch: React.FC<AcousticFeaturesProps> = ({ annotation }) => {
    const updateFeatures = useUpdateAnnotationFeatures()
    const removeFeatures = useRemoveAnnotationFeatures()

    const [ quantity, _setQuantity ] = useState<Quantity>('multiple');
    const setQuantity = useCallback((newQuantity: Quantity) => {
        _setQuantity(newQuantity)
        switch (newQuantity) {
            case 'single':
                if (annotation.acousticFeatures) return;
                updateFeatures(annotation, {})
                break;
            case 'multiple':
                removeFeatures(annotation)
        }
    }, [ annotation, updateFeatures, removeFeatures ])
    return <Field.Root horizontal>
        <Field.Label>Quantity</Field.Label>
        <Toggle.Group value={ quantity } onValueChange={ setQuantity }>
            <Toggle.Item value={ 'multiple' as Quantity }>Multiple</Toggle.Item>
            <Toggle.Item value={ 'single' as Quantity }>Single</Toggle.Item>
        </Toggle.Group>
    </Field.Root>
}