import React, { useCallback, useMemo } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, Toast } from '@/components/base'
import * as API from '../api'

type Props =
    Omit<ComboboxSelectProps<API.FormatFragment>, 'createForm' | 'itemName' | 'inputKey'>
    & {
    fixedValueID?: string;
}

export const FormatSelect: React.FC<Props> = ({ creatable, fixedValueID, ...props }) => {
    const toastManager = Toast.useToastManager()
    const { data: allFormats, isFetching } = useQuery(API.allFormatsQuery)
    const { mutateAsync, isPending } = useMutation(API.createFormat)

    const fixedValue = useMemo(() => {
        return allFormats?.find(i => i.id === fixedValueID)
    }, [ allFormats, fixedValueID ])

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
                           defaultValue={ fixedValue }
                           value={ fixedValue }
                           readOnly={ !!fixedValue }
                           loading={ isFetching || isPending }
                           creatable={ creatable }
                           create={ create }
                           { ...props }/>
}
