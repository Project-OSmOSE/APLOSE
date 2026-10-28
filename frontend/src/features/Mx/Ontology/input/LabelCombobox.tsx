import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base';
import * as API from '../api';

type Props<Multiple extends boolean = false> = Omit<
    ComboboxSelectProps<API.LabelFragment, Multiple>,
    'itemName' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue'
>
export const LabelCombobox = <Multiple extends boolean = false>({ items, ...props }: Props<Multiple>) => {
    const { data: labels, isFetching } = useQuery({ ...API.allLabels, enabled: !items })

    return <ComboboxSelect itemName="label"
                           items={ items ?? labels }
                           itemToStringValue={ itemValue => itemValue.id }
                           itemToStringLabel={ itemValue => itemValue.source.englishName + (itemValue.sound ? ` - ${ itemValue.sound.englishName }` : '') }
                           itemToElementLabel={ itemValue => itemValue.displayName }
                           loading={ isFetching }
                           isItemEqualToValue={ (itemValue, value) => itemValue.id == value.id }
                           { ...props }
                           creatable={ false }/> // Create 'create' form dialog before unlocking it
}