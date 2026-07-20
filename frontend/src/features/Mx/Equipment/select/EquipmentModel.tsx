import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ComboboxSelectProps, ComboboxSelect } from '@/components/base/Combobox'
import { NewEquipmentModelDialog } from '../NewEquipmentModelDialog'
import * as API from '../api'

type Props =
    Omit<ComboboxSelectProps<API.EquipmentModelFragment, API.CreateEquipmentModelMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>
    & {
    fixedValueID?: string;
}

export const EquipmentModelSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const { data: models } = useQuery(API.allEquipmentModelQuery)

    const fixedValue = useMemo(() => {
        return models?.find(i => i.id === fixedValueID)
    }, [ models, fixedValueID ])

    return <ComboboxSelect itemName="equipment model"
                           creatable={ creatable }
                           createDialog={ NewEquipmentModelDialog }
                           items={ models }
                           inputKey="name"
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
