import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, CreateDialog } from '@/components/base'
import { NewInstitutionForm } from '../form'
import * as API from '../api'

type Value = API.InstitutionFragment
type Input = API.CreateInstitutionMutationVariables['input']

type Props =
    Omit<ComboboxSelectProps<Value>, 'create' | 'itemName'>
    & {
    fixedValueID?: string;
}

export const InstitutionSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: institutions, isFetching } = useQuery(API.allInstitutionsQuery)

    const fixedValue = useMemo(() => {
        return institutions?.find(i => i.id === fixedValueID)
    }, [ institutions, fixedValueID ])

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
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           inputKey="name"
                           loading={ isFetching }
                           creatable={ creatable }
                           create={ create }
                           { ...props }/>
}
