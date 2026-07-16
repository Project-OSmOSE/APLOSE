import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxCreatableSelect, ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewInstitutionDialog } from './NewInstitutionDialog'
import * as API from './api'

type Props =
    Omit<ComboboxSelectProps<API.InstitutionFragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName' | 'value' | 'onValueChange'>
    & { creatable?: boolean }

export const InstitutionSelect: React.FC<Props> = ({ creatable, ...props }) => {
    const { data: institutions } = useQuery(API.allInstitutionsQuery)

    if (creatable)
        return <ComboboxCreatableSelect createDialog={ NewInstitutionDialog }
                                        items={ institutions }
                                        itemName="institution"
                                        itemToStringLabel={ item => item.name }
                                        itemToStringValue={ item => item.id }
                                        isItemEqualToValue={ (a, b) => a.id === b.id }
                                        { ...props }/>
    else
        return <ComboboxSelect itemName="institution"
                               items={ institutions }
                               itemToStringLabel={ item => item.name }
                               itemToStringValue={ item => item.id }
                               isItemEqualToValue={ (a, b) => a.id === b.id }
                               { ...props }/>
}
