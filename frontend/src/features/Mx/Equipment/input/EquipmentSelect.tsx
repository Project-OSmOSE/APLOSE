import React, { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, CreateDialog } from '@/components/base';
import { NewEquipmentForm } from '../form'
import * as API from '../api'

type Value = API.EquipmentFragment
type Input = API.CreateEquipmentMutationVariables['input']
type Props =
    Omit<ComboboxSelectProps<API.EquipmentFragment>, 'create' | 'itemName'>
    & {
    fixedValueID?: string;
} & API.AllEquipmentsQueryVariables

export const EquipmentSelect: React.FC<Props> = ({
                                                     creatable,
                                                     fixedValueID,
                                                     isDetector,
                                                     isHydrophone,
                                                     isStorage,
                                                     isRecorder,
                                                     ...props
                                                 }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: equipments, isFetching } = useQuery(API.allEquipmentQuery({
        isRecorder,
        isStorage,
        isHydrophone,
        isDetector,
    }))

    const fixedValue = useMemo(() => {
        return equipments?.find(i => i.id === fixedValueID)
    }, [ equipments, fixedValueID ])

    const create = useCallback((name: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New equipment`,
            form: NewEquipmentForm,
            input: { name } as Input,
        })
    }, [ createDialogManager ])

    return <ComboboxSelect itemName="equipment"
                           creatable={ creatable }
                           create={ create }
                           items={ equipments }
                           itemToStringLabel={ (item: Value) => item.displayName }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           loading={ isFetching }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
