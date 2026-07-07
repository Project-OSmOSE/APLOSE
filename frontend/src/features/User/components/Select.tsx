import React from 'react';
import { UserNode } from '@/api';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox';

type SelectValue = Pick<UserNode, 'id' | 'displayName'>
export const Select: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="user"
                    itemToStringLabel={ item => item.displayName }
                    itemToStringValue={ item => item.id }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
