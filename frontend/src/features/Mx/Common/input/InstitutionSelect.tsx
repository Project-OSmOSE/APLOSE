import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, CreateDialog } from '@/components/base'
import { NewInstitutionForm } from '../form'
import * as API from '../api'

type Value = API.InstitutionFragment
type Input = API.CreateInstitutionMutationVariables['input']

type Props = Omit<ComboboxSelectProps<Value>, 'create' | 'itemName'>

export const InstitutionSelect: React.FC<Props> = ({ creatable, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: institutions, isFetching } = useQuery(API.allInstitutionsQuery)

    const create = useCallback((name: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New institution`,
            form: NewInstitutionForm,
            input: { name } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="institution"
                           items={ institutions }
                           itemToStringLabel={ (item: Value) => item.name }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           loading={ isFetching }
                           creatable={ creatable }
                           create={ create }
                           { ...props }/>
}
