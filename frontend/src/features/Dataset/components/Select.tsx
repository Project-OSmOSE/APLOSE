import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'

import type { AllDatasetsQuery } from '../api'
import * as API from '../api'

type N<T> = NonNullable<T>
export type SelectValue = N<N<AllDatasetsQuery['allDatasets']>['results'][number]>
export const Select: React.FC<Omit<ComboboxSelectProps<SelectValue>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) => {
    const { data: datasets } = useQuery(API.allQuery)
    return <ComboboxSelect itemName='dataset'
                           items={ datasets }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           { ...props }/>
}
