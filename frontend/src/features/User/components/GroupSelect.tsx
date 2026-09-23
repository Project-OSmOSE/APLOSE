import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base';
import * as API from '../api';

export const GroupSelect: React.FC<Omit<ComboboxSelectProps<API.GroupFragment>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName' | 'filter'>> =
    ({ items, loading, ...props }) => {
        const {
            data,
            isPending,
        } = useQuery({ ...API.allGroupsQuery, enabled: !items })

        return <ComboboxSelect itemName="user group"
                               items={ items ?? data }
                               itemToStringLabel={ (item: API.GroupFragment) => item.name }
                               itemToStringValue={ (item: API.GroupFragment) => item.id }
                               isItemEqualToValue={ (a: API.GroupFragment, b: API.GroupFragment) => a.id === b.id }
                               loading={ (!items && isPending) || loading }
                               { ...props }/>
    }
