import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { CreateDialog } from '@/components/base';
import { NewSourceForm } from '../form'
import * as API from '../api'
import { User } from "@/features/User";

type Props = Omit<ComboboxSelectProps<API.SourceFragment>, 'create' | 'itemName'>

export const SourceSelect: React.FC<Props> = ({ creatable, value, ...props }) => {
    const {data: user} = useQuery(User.currentQuery)
    const createDialogManager = CreateDialog.useManager()
    const { data: sources, isFetching } = useQuery(API.allSources)

    const create = useCallback((entry: string) => {
        const input: Partial<API.CreateSourceInput> = {}
        switch (user?.labelDisplayPreference) {
            case User.LabelDisplayPreferenceType.French:
                input.frenchName = entry
                break
            case User.LabelDisplayPreferenceType.Code:
                input.codeName = entry
                break
            case User.LabelDisplayPreferenceType.English:
            default:
                input.englishName = entry
                break
        }
        return createDialogManager.create<API.SourceFragment, API.CreateSourceInput>({
            title: `New source`,
            form: NewSourceForm,
            input,
        })
    }, [ createDialogManager, user ])

    return <ComboboxSelect itemName="source"
                           creatable={ creatable }
                           create={ create }
                           items={ sources }
                           loading={ isFetching }
                           itemToStringLabel={ (item: API.SourceFragment) => item.preferredDisplay }
                           itemToStringValue={ (item: API.SourceFragment) => item.id }
                           isItemEqualToValue={ (a: API.SourceFragment, b: API.SourceFragment) => a.id === b.id }
                           value={ value }
                           { ...props }/>
}
