import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewPersonDialog } from './NewPersonDialog'
import * as API from './api'

type Props =
    Omit<ComboboxSelectProps<API.PersonFragment, API.CreatePersonMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>

export const PersonSelect: React.FC<Props> = ({ creatable, items, ...props }) => {
    const { data: persons, isFetching } = useQuery({ ...API.allPersonsQuery, enabled: !items })

    return <ComboboxSelect itemName="person"
                           itemToStringLabel={ item => `${ item.firstName } ${ item.lastName }` }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           creatable={ creatable }
                           loading={ isFetching }
                           createDialog={ NewPersonDialog }
                           items={ items || persons }
                           inputKey="lastName"
                           { ...props }/>
}
