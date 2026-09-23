import React, { useCallback } from 'react';
import { Combobox, ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox';
import { useQuery } from '@tanstack/react-query';
import * as API from '@/features/User/api';

export const Select: React.FC<Omit<ComboboxSelectProps<API.UserFragment>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName' | 'filter'>> =
    ({ items, loading, ...props }) => {
        const {
            data,
            isPending,
        } = useQuery({ ...API.allQuery, enabled: !items })

        const { contains } = Combobox.useFilter({
            usage: 'search',
            sensitivity: 'base',
        })
        const filter = useCallback((itemValue: API.UserFragment, query: string) => {
            return contains(itemValue, query, (item: API.UserFragment) => {
                return [ item.displayName, item.username ].join(' ')
            })
        }, [ contains ]);

        return <ComboboxSelect itemName="user"
                               items={ items ?? data }
                               itemToStringLabel={ (item: API.UserFragment) => item.displayName }
                               itemToStringValue={ (item: API.UserFragment) => item.id }
                               isItemEqualToValue={ (a: API.UserFragment, b: API.UserFragment) => a.id === b.id }
                               loading={ (!items && isPending) || loading }
                               filter={ filter }
                               { ...props }/>
    }
