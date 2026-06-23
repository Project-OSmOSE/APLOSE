import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'

import type { ListLabelSetsQuery } from '../api'

type N<T> = NonNullable<T>
export type SelectValue = N<N<ListLabelSetsQuery['allLabelSets']>['results'][number]>
export const SetSelect: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) =>
    <ComboboxSelect itemName="label set"
                    itemToStringLabel={ item => item.name }
                    itemToStringValue={ item => item.id }
                    isItemEqualToValue={ (a, b) => a.id === b.id }
                    { ...props }/>
