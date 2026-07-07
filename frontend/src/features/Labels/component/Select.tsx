import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { AnnotationLabelNode } from '@/api';

type SelectValue = Pick<AnnotationLabelNode, 'name' | 'id'>;
export const Select: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="label"
                    itemToStringLabel={ item => item.name }
                    itemToStringValue={ item => item.id }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
