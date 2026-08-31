import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { CreateDialog } from '@/components/base';
import { NewSourceForm } from '../form'
import * as API from '../api'

type Value = API.SourceFragment
type Input = API.CreateSourceMutationVariables['input']
type Props = Omit<ComboboxSelectProps<Value>, 'create' | 'itemName'>

export const SourceSelect: React.FC<Props> = ({ creatable, value, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: sources, isFetching } = useQuery(API.allSources)

    const create = useCallback((englishName: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New source`,
            form: NewSourceForm,
            input: { englishName } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="source"
                           creatable={ creatable }
                           create={ create }
                           items={ sources }
                           loading={ isFetching }
                           itemToStringLabel={ (item: Value) => item.displayName }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           value={ value }
                           { ...props }/>
}
