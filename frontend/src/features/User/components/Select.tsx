import React, { useCallback } from 'react';
import { Combobox, ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox';
import { useQuery } from '@tanstack/react-query';
import * as API from '../api';

export const Select: React.FC<Omit<ComboboxSelectProps<API.Fragment>, 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName' | 'filter'>> =
    ({ items, loading, ...props }) => {
        const {
            data,
            isPending,
        } = useQuery({ ...API.allQuery, enabled: !items })

        const { contains } = Combobox.useFilter({
            usage: 'search',
            sensitivity: 'base',
        })
        const filter = useCallback((itemValue: API.Fragment, query: string) => {
            return contains(itemValue, query, (item: API.Fragment) => {
                return [ item.displayName, item.username ].join(' ')
            })
        }, [ contains ]);

        return <ComboboxSelect itemName="user"
                               items={ items ?? data }
                               itemToStringLabel={ (item: API.Fragment) => item.displayName }
                               itemToStringValue={ (item: API.Fragment) => item.id }
                               isItemEqualToValue={ (a: API.Fragment, b: API.Fragment) => a.id === b.id }
                               loading={ (!items && isPending) || loading }
                               filter={ filter }
                               { ...props }/>
    }
