import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewTeamForm } from '../form'
import * as API from '../api'
import { CreateDialog } from '@/components/base';

type Value = API.TeamFragment
type Input = API.CreateTeamMutationVariables['input']

type Props = Omit<ComboboxSelectProps<API.TeamFragment>, 'create' | 'itemName'> & {
    additionalInput?: Partial<Input>
}

export const TeamSelect: React.FC<Props> = ({
                                                creatable,
                                                items,
                                                additionalInput,
                                                ...props
                                            }) => {
    const createDialogManager = CreateDialog.useManager()
    const { data: teams, isFetching } = useQuery({ ...API.allTeamsQuery, enabled: !items })

    const create = useCallback((name: string) => {
        return createDialogManager.create<Value, Input>({
            title: `New team`,
            form: NewTeamForm,
            input: { ...additionalInput, name } as Input,
        })
    }, [ createDialogManager, additionalInput ])

    return <ComboboxSelect itemName="team"
                           itemToStringLabel={ (item: Value) => item.name }
                           itemToStringValue={ (item: Value) => item.id }
                           isItemEqualToValue={ (a: Value, b: Value) => a.id === b.id }
                           creatable={ creatable }
                           create={ create }
                           items={ items || teams }
                           loading={ isFetching }
                           { ...props }/>
}
