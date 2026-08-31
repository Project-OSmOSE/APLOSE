import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base';
import * as API from '../api';

type Props = Omit<ComboboxSelectProps<API.LabelFragment, true>, 'itemName' | 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'>
export const LabelMultiCombobox: React.FC<Props> = (props) => {
    const { data: labels, isPending } = useQuery(API.allLabels)

    return <ComboboxSelect itemName="label"
                           multiple
                           items={ labels }
                           itemToStringValue={ itemValue => itemValue.id }
                           itemToStringLabel={ itemValue => itemValue.displayName }
                           loading={ isPending }
                           isItemEqualToValue={ (itemValue, value) => itemValue.id == value.id }
                           { ...props }
                           creatable={ false }/> // Create 'create' form dialog before unlocking it
}