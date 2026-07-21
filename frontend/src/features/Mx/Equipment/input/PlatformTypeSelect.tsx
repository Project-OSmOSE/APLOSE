import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ComboboxSelectProps, ComboboxSelect } from '@/components/base/Combobox'
import { NewPlatformTypeForm } from '../form'
import * as API from '../api'

type Props =
    Omit<ComboboxSelectProps<API.PlatformTypeFragment, API.CreatePlatformTypeMutationVariables['input']>, 'createForm' | 'itemName' | 'inputKey'>
    & {
    fixedValueID?: string;
}

export const PlatformTypeSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const { data: types } = useQuery(API.allPlatformTypesQuery)

    const fixedValue = useMemo(() => {
        return types?.find(i => i.id === fixedValueID)
    }, [ types, fixedValueID ])

    return <ComboboxSelect itemName="platform type"
                           creatable={ creatable }
                           createForm={ NewPlatformTypeForm }
                           items={ types }
                           inputKey="name"
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           { ...props }/>
}
