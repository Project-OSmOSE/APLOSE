import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ComboboxSelectProps, ComboboxSelect } from '@/components/base/Combobox'
import { NewTeamDialog } from './NewTeamDialog'
import * as API from './api'

type Props =
    Omit<ComboboxSelectProps<API.TeamFragment, API.CreateTeamMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>

export const TeamSelect: React.FC<Props> = ({ creatable, items, ...props }) => {
    const { data: teams } = useQuery({ ...API.allTeamsQuery, enabled: !items })

    return <ComboboxSelect itemName="team"
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           creatable={ creatable }
                           createDialog={ NewTeamDialog }
                           items={ items || teams }
                           inputKey="name"
                           { ...props }/>
}
