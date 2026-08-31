import React, { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps, Toast } from '@/components/base';
import type { BehaviorFragment } from '../api';
import * as API from '../api';


type Props =
    Omit<ComboboxSelectProps<API.BehaviorFragment, true>, 'itemName' | 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'onValueChange'>
    & {
    creatable?: boolean,
    onValueChange?: (value: API.BehaviorFragment[]) => void;
}
export const BehaviorMultiCombobox: React.FC<Props> = (props) => {
    const { data: items, isFetching } = useQuery(API.allBehaviors)
    const { mutateAsync } = useMutation(API.createBehavior)
    const toastManager = Toast.useToastManager()

    const create = useCallback(async (name: string): Promise<BehaviorFragment | undefined> => {
        try {
            const created = await mutateAsync({ name })
            if (created?.behavior) return created.behavior
            if (created?.errors?.length) {
                toastManager.addGqlError({ errors: created.errors, title: 'Fail creating behavior' })
            }
        } catch (error) {
            toastManager.addError({ error, title: 'Fail creating behavior' })
        }
    }, [ toastManager, mutateAsync ])

    return <ComboboxSelect itemName="behavior"
                           items={ items }
                           itemToStringValue={ itemValue => itemValue.id }
                           itemToStringLabel={ itemValue => itemValue.name }
                           disabled={ isFetching }
                           multiple
                           isItemEqualToValue={ (itemValue, value) => itemValue.id == value.id }
                           create={ create }
                           { ...props }/>
}
