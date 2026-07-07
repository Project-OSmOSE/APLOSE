import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'

import * as API from '../api'

type N<T> = NonNullable<T>
export type SelectValue = N<N<API.ListLabelSetsQuery['allLabelSets']>['results'][number]>
export const SetSelect: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) => {
    const { data: labelSets } = useQuery(API.allSetsQuery)
    return <ComboboxSelect itemName="label set"
                           items={ labelSets }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           { ...props }/>
}
