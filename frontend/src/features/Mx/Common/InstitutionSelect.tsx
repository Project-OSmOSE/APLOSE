import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base'
import { NewInstitutionDialog } from './NewInstitutionDialog'
import * as API from './api'

type Props =
    Omit<ComboboxSelectProps<API.InstitutionFragment, API.CreateInstitutionMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>
    & {
    fixedValueID?: string;
}

export const InstitutionSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const { data: institutions } = useQuery(API.allInstitutionsQuery)

    const fixedValue = useMemo(() => {
        return institutions?.find(i => i.id === fixedValueID)
    }, [ institutions, fixedValueID ])

    return <ComboboxSelect itemName="institution"
                           items={ institutions }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           inputKey="name"
                           createDialog={ NewInstitutionDialog }
                           creatable={ creatable }
                           { ...props }/>
}
