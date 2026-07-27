import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewPlatformForm } from '../form'
import * as API from '../api'
import { CreateDialog } from '@/components/base';

type Value = API.PlatformFragment
type Input = API.CreatePlatformMutationVariables['input']
type Props =
    Omit<ComboboxSelectProps<Value>, 'create' | 'itemName'>
    & {
    fixedValueID?: string;
}

export const PlatformSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: platforms, isFetching } = useQuery(API.allPlatformQuery)

    const fixedValue = useMemo(() => {
        return platforms?.find(i => i.id === fixedValueID)
    }, [ platforms, fixedValueID ])

    const create = useCallback((name: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New platform`,
            form: NewPlatformForm,
            input: { name } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="platform"
                           creatable={ creatable }
                           create={ create }
                           items={ platforms }
                           itemToStringLabel={ (item: Value) => item.displayName }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           defaultValue={ fixedValue }
                           loading={ isFetching }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
