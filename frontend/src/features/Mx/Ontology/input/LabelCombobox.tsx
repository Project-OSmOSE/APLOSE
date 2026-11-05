import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base';
import * as API from '../api';
import { useCallback } from "react";

type Props<Multiple extends boolean = false> = Omit<
    ComboboxSelectProps<API.LabelFragment, Multiple>,
    'itemName' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'filter'
>
export const LabelCombobox = <Multiple extends boolean = false>({ items, ...props }: Props<Multiple>) => {
    const { data: labels, isFetching } = useQuery({ ...API.allLabels, enabled: !items })

    const filter = useCallback((itemValue: API.LabelFragment, query: string): boolean => {
        const refStrings = [
                ...itemValue.preferredDisplay.split(' '),
                ...itemValue.source.englishName.split(' '),
                ...(itemValue.sound?.englishName.split(' ') ?? []),
        ].map(s => s.toLocaleLowerCase())
        return query.split(' ').reduce((prevMatch, queryPart) => prevMatch && refStrings.some(s => s.match(queryPart.toLocaleLowerCase())), true)
    }, [ items, labels ])

    return <ComboboxSelect itemName="label"
                           items={ items ?? labels }
                           itemToStringValue={ itemValue => itemValue.id }
                           itemToStringLabel={ itemValue => itemValue.source.englishName + (itemValue.sound ? ` - ${ itemValue.sound.englishName }` : '') }
                           itemToElementLabel={ itemValue => itemValue.preferredDisplay }
                           loading={ isFetching }
                           isItemEqualToValue={ (itemValue, value) => itemValue.id == value.id }
                           filter={ filter }
                           { ...props }
                           creatable={ false }/> // Create 'create' form dialog before unlocking it
}