import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewPlatformTypeForm } from '../form'
import * as API from '../api'
import { CreateDialog } from '@/components/base';

type Value = API.PlatformTypeFragment
type Input = API.CreatePlatformTypeMutationVariables['input']
type Props =
    Omit<ComboboxSelectProps<Value>, 'create' | 'itemName'>
    & {
    fixedValueID?: string;
}

export const PlatformTypeSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: types } = useQuery(API.allPlatformTypesQuery)

    const fixedValue = useMemo(() => {
        return types?.find(i => i.id === fixedValueID)
    }, [ types, fixedValueID ])

    const create = useCallback((name: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New platform type`,
            form: NewPlatformTypeForm,
            input: { name } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="platform type"
                           creatable={ creatable }
                           create={ create }
                           items={ types }
                           itemToStringLabel={ (item: Value) => item.name }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
