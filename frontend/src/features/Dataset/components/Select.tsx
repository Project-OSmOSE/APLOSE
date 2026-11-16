import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, Note } from '@/components/base'
import * as API from '../api'

type Props =
    Omit<ComboboxSelectProps<API.BaseFragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName' | 'filter'>
    & API.AllQueryVariables
export const DatasetSelect: React.FC<Props> = ({ archived, ...props }) => {
    const { data: datasets } = useQuery(API.allQuery({ archived }))

    const filter = useCallback((itemValue: API.BaseFragment, query: string): boolean => {
        const refStrings = [
            itemValue.name,
            itemValue.path,
            ...itemValue.path.split('/'),
        ].map(s => s.toLocaleLowerCase())
        return query.split(' ').reduce((prevMatch, queryPart) => prevMatch && refStrings.some(s => s.match(queryPart.toLocaleLowerCase())), true)
    }, [])

    return <ComboboxSelect itemName='dataset'
                           items={ datasets }
                           itemToStringLabel={ item => item.name }
                           itemToElementLabel={ item => <div>
                               { item.name }<br/>
                               <Note color='medium'>{ item.path }</Note>
                           </div> }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           filter={ filter }
                           { ...props }/>
}
