import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { ComboboxSelect, type ComboboxSelectProps } from '@/components/base/Combobox'
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';

import { AllProjectSelectsDocument, type AllProjectSelectsQuery, ProjectSelectFragment } from './query.generated'

export const ProjectSelect: React.FC<Omit<ComboboxSelectProps<ProjectSelectFragment>, 'items' | 'itemToStringLabel' | 'itemToStringValue' | 'isItemEqualToValue' | 'itemName'>> = (props) => {
    const { data: projects } = useQuery({
        queryKey: queryKeys.mx.acquisition.project.allSelect,
        queryFn: () => graphqlClient.request<AllProjectSelectsQuery>(AllProjectSelectsDocument, {})
            .then(data => cleanGqlList(data.allProjects?.results)),
    })
    return <ComboboxSelect itemName="project"
                           items={ projects }
                           itemToStringLabel={ item => item.name }
                           itemToStringValue={ item => item.id }
                           isItemEqualToValue={ (a, b) => a.id === b.id }
                           { ...props }/>
}
