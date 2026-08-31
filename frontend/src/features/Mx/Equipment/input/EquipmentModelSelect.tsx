import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, CreateDialog } from '@/components/base';
import { NewEquipmentModelForm } from '../form'
import * as API from '../api'

type Value = API.EquipmentModelFragment
type Input = API.CreateEquipmentModelMutationVariables['input']
type Props = Omit<ComboboxSelectProps<API.EquipmentModelFragment>, 'create' | 'itemName'>

export const EquipmentModelSelect: React.FC<Props> = ({ creatable, ...props }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: models } = useQuery(API.allEquipmentModelQuery)

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
                           { ...props }/>
}
