import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Combobox, ComboboxSelect, type ComboboxSelectProps, type FinalValue } from '@/components/base';
import * as API from '../api'


type SearchValue<WithGroup extends boolean = false> = WithGroup extends true ? API.UserFragment | API.UserGroupFragment : API.UserFragment
type Props<WithGroup extends boolean = false> =
    Omit<ComboboxSelectProps<SearchValue<WithGroup>>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName' | 'isPending'>
    & {
    withGroup?: WithGroup;
    onSearch: (item: (FinalValue<SearchValue<WithGroup>>)) => void,
}

export function Search<WithGroup extends boolean = false>({ withGroup, onSearch, ...props }: Props<WithGroup>) {
    const {
        data,
        isPending,
    } = useQuery(API.allQuery)
    const [ inputValue, setInputValue ] = useState<string>('');

    const items = useMemo(() => {
        if (!data) return []
        if (!withGroup) return data.users
        return [ ...data.users, ...data.groups ]
    }, [ data ]);

    const { contains } = Combobox.useFilter({
        usage: 'search',
        sensitivity: 'base',
    })
    const filteredItems = useMemo(() => {
        return items.filter(i => contains(i, inputValue, (item: API.UserFragment | API.UserGroupFragment) => {
            switch (item.__typename) {
                case 'UserGroupNode':
                    return item.name
                case 'UserNode':
                    return [ item.displayName, item.username ].join(' ')
            }
        }))
    }, [ items, inputValue, contains ])

    return <ComboboxSelect items={ items }
                           itemName={ withGroup ? 'user or group' : 'user ' }
                           itemToStringLabel={ (item: API.UserFragment | API.UserGroupFragment) => {
                               switch (item.__typename) {
                                   case 'UserGroupNode':
                                       return item.name
                                   case 'UserNode':
                                       return item.displayName
                               }
                           } }
                           itemToStringValue={ (item: SearchValue<WithGroup>) => `${ item.__typename }-${ item.id }` }
                           isItemEqualToValue={ (a: SearchValue<WithGroup>, b: SearchValue<WithGroup>) => a.id === b.id && a.__typename === b.__typename }
                           loading={ isPending }
                           inputValue={ inputValue }
                           onInputValueChange={ setInputValue }
                           filteredItems={ filteredItems }
                           onValueChange={ onSearch }
                           { ...props }/>
}
