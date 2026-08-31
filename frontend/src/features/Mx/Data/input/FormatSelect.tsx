import { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, Toast } from '@/components/base'
import * as API from '../api'

type Props<Multiple extends boolean = false> = Omit<ComboboxSelectProps<API.FormatFragment, Multiple>, 'createForm' | 'itemName' | 'inputKey'>

export function FormatSelect<Multiple extends boolean = false>(props: Props<Multiple>) {
    const toastManager = Toast.useToastManager()
    const { data: allFormats, isFetching } = useQuery(API.allFormatsQuery)
    const { mutateAsync } = useMutation(API.createFormat)

    const create = useCallback(async (name: string) => {
        const data = await mutateAsync({ name })
        if (data?.errors)
            toastManager.addGqlError({ errors: data.errors })
        if (data?.fileFormat)
            return data?.fileFormat
    }, [ mutateAsync, toastManager ])

    return <ComboboxSelect itemName="institution"
                           items={ allFormats }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           loading={ isFetching }
                           create={ create }
                           { ...props }/>
}
