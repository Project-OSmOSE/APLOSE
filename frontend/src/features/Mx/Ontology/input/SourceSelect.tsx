import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { CreateDialog } from '@/components/base';
import { NewSourceForm } from '../form'
import * as API from '../api'

type Value = API.SourceFragment
type Input = API.CreateSourceMutationVariables['input']
type Props =
    Omit<ComboboxSelectProps<Value>, 'create' | 'itemName'>
    & {
    fixedValueID?: string;
}

export const SourceSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: sources } = useQuery(API.allSources)

    const fixedValue = useMemo(() => {
        return sources?.find(i => i.id === fixedValueID)
    }, [ sources, fixedValueID ])

    const create = useCallback((englishName: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New source`,
            form: NewSourceForm,
            input: { englishName } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="platform type"
                           creatable={ creatable }
                           create={ create }
                           items={ sources }
                           itemToStringLabel={ (item: Value) => item.displayName }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
