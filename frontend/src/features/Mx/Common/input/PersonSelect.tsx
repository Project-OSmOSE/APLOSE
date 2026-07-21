import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewPersonForm } from '../form'
import * as API from '../api'
import { CreateDialog } from '@/components/base';

type Value = API.PersonFragment
type Input = API.CreatePersonMutationVariables['input']

type Props =
    Omit<ComboboxSelectProps<API.PersonFragment>, 'create' | 'itemName'>

export const PersonSelect: React.FC<Props> = ({ creatable, items, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: persons, isFetching } = useQuery({ ...API.allPersonsQuery, enabled: !items })

    const create = useCallback((lastName: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New person`,
            form: NewPersonForm,
            input: { lastName } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="person"
                           itemToStringLabel={ (item: Value) => `${ item.firstName } ${ item.lastName }` }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           loading={ isFetching }
                           creatable={ creatable }
                           create={ create }
                           items={ items || persons }
                           { ...props }/>
}
