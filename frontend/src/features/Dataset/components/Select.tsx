import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'

import * as API from '../api'

type N<T> = NonNullable<T>
export type SelectValue = N<N<API.AllQuery['allDatasets']>['results'][number]>
type Props =
    Omit<ComboboxSelectProps<SelectValue>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>
    & API.AllQueryVariables
export const DatasetSelect: React.FC<Props> = ({ archived, ...props }) => {
    const { data: datasets } = useQuery(API.allQuery({ archived }))
    return <ComboboxSelect itemName='dataset'
                           items={ datasets }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           { ...props }/>
}
