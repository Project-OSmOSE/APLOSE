import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import type { DetectorNode } from '@/api';

export type SelectValue = Pick<DetectorNode, 'id' | 'name'>
export const Select: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName='detector'
                    itemToStringLabel={ item => item.name }
                    itemToStringValue={ item => item.id }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
