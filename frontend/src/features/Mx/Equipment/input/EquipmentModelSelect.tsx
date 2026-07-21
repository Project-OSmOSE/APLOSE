import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, CreateDialog } from '@/components/base';
import { NewEquipmentModelForm } from '../form'
import * as API from '../api'

type Value = API.EquipmentModelFragment
type Input = API.CreateEquipmentModelMutationVariables['input']
type Props =
    Omit<ComboboxSelectProps<API.EquipmentModelFragment>, 'create' | 'itemName'>
    & {
    fixedValueID?: string;
}

export const EquipmentModelSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: models } = useQuery(API.allEquipmentModelQuery)

    const fixedValue = useMemo(() => {
        return models?.find(i => i.id === fixedValueID)
    }, [ models, fixedValueID ])

    const create = useCallback((name: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New equipment model`,
            form: NewEquipmentModelForm,
            input: { name } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="equipment model"
                           creatable={ creatable }
                           create={ create }
                           items={ models }
                           itemToStringLabel={ (item: Value) => item.name }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
