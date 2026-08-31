import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base'
import { type ConfidenceNode } from '@/api';

type SelectValue = Pick<ConfidenceNode, 'label' | 'id'>;
export const Select: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="confidence"
                    itemToStringLabel={ item => item.label }
                    itemToStringValue={ item => item.id }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
