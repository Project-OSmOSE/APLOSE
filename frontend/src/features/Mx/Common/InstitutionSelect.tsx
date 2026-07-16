import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ComboboxCreatableProps, ComboboxCreatableSelect, ComboboxSelect } from '@/components/base/Combobox'
import { NewInstitutionDialog } from './NewInstitutionDialog'
import * as API from './api'

type Props =
    Omit<ComboboxCreatableProps<API.InstitutionFragment, API.CreateInstitutionMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>
    & {
    creatable?: boolean,
    onValueChange?: (value: API.InstitutionFragment | null) => void,
    fixedValueID?: string;
}

export const InstitutionSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const { data: institutions } = useQuery(API.allInstitutionsQuery)

    const fixedValue = useMemo(() => {
        return institutions?.find(i => i.id === fixedValueID)
    }, [ institutions, fixedValueID ])

    if (creatable)
        return <ComboboxCreatableSelect createDialog={ NewInstitutionDialog }
                                        items={ institutions }
                                        itemName="institution"
                                        inputKey="name"
                                        itemToStringLabel={ item => item.name }
                                        itemToStringValue={ item => item.id }
                                        isItemEqualToValue={ (a, b) => a.id === b.id }
                                        defaultValue={ fixedValue }
                                        value={ fixedValue }
                                        readOnly={ !!fixedValue }
                                        { ...props }/>
    else
        return <ComboboxSelect itemName="institution"
                               items={ institutions }
                               itemToStringLabel={ item => item.name }
                               itemToStringValue={ item => item.id }
                               isItemEqualToValue={ (a, b) => a.id === b.id }
                               { ...props }/>
}
