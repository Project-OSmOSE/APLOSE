import React from 'react';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { useQuery } from '@tanstack/react-query';
import * as API from '../api';

type N<T> = NonNullable<T>
export type SelectValue = N<N<API.ListConfidenceSetsQuery['allConfidenceSets']>['results'][number]>
export const SetSelect: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) => {
    const { data: confidenceSets } = useQuery(API.allSetsQuery)
    return <ComboboxSelect itemName="confidence"
                           items={ confidenceSets }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           { ...props }/>
}
