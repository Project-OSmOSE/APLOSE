import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base';
import * as API from '../api';

type Props<Multiple extends boolean = false> = Omit<
    ComboboxSelectProps<API.AllFragment, Multiple>,
    'itemName' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'filter'
>
export const CampaignCombobox = <Multiple extends boolean = false>({ items, loading, ...props }: Props<Multiple>) => {
    const { data: campaigns, isFetching } = useQuery({ ...API.allQuery({}), enabled: !items })

    return <ComboboxSelect itemName="label"
                           items={ items ?? campaigns }
                           itemToStringValue={ itemValue => itemValue.id }
                           itemToStringLabel={ itemValue => itemValue.name }
                           itemToElementLabel={ itemValue => itemValue.name }
                           loading={ isFetching || loading }
                           isItemEqualToValue={ (itemValue, value) => itemValue.id == value.id }
                           { ...props }
                           creatable={ false }/> // Create 'create' form dialog before unlocking it
}