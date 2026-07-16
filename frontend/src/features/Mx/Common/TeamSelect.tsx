import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { type ComboboxCreatableProps, ComboboxCreatableSelect, ComboboxSelect } from '@/components/base/Combobox'
import { NewTeamDialog } from './NewTeamDialog'
import * as API from './api'

type Props =
    Omit<ComboboxCreatableProps<API.TeamFragment, API.CreateTeamMutationVariables['input']>, 'createDialog' | 'itemName' | 'inputKey'>
    & { creatable?: boolean }

export const TeamSelect: React.FC<Props> = ({ creatable, items, ...props }) => {
    const { data: teams } = useQuery({ ...API.allTeamsQuery, enabled: !items })

    if (creatable)
        return <ComboboxCreatableSelect createDialog={ NewTeamDialog }
                                        items={ items || teams }
                                        itemName="team"
                                        inputKey="name"
                                        itemToStringLabel={ item => item.name }
                                        itemToStringValue={ item => item.id }
                                        isItemEqualToValue={ (a, b) => a.id === b.id }
                                        { ...props }/>
    else
        return <ComboboxSelect itemName="team"
                               items={ teams }
                               itemToStringLabel={ item => item.name }
                               itemToStringValue={ item => item.id }
                               isItemEqualToValue={ (a, b) => a.id === b.id }
                               { ...props }/>
}
