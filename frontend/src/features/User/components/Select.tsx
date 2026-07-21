import React from 'react';
import { UserNode } from '@/api';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox';

type SelectValue = Pick<UserNode, 'id' | 'displayName'>
export const Select: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="user"
                    itemToStringLabel={ (item: SelectValue) => item.displayName }
                    itemToStringValue={ (item: SelectValue) => item.id }
                    isItemEqualToValue={ (a: SelectValue, b: SelectValue) => a.id === b.id }
                    { ...props }/>
