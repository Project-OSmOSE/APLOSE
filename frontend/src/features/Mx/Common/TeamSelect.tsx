import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { NewTeamDialog } from './NewTeamDialog'
import * as API from './api'

type Props =
    Omit<ComboboxSelectProps<API.TeamFragment, API.CreateTeamMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>

export const TeamSelect: React.FC<Props> = ({ creatable, items, ...props }) => {
    const { data: teams, isFetching } = useQuery({ ...API.allTeamsQuery, enabled: !items })

    return <ComboboxSelect itemName="team"
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           creatable={ creatable }
                           createDialog={ NewTeamDialog }
                           items={ items || teams }
                           loading={ isFetching }
                           inputKey="name"
                           { ...props }/>
}
