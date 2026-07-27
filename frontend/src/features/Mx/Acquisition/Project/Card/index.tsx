import React, { useMemo } from 'react';
import { AllProjectCardsDocument, type AllProjectCardsQuery, ProjectCardFragment } from './query.generated'
import { Card, Note } from '@/components/base';
import { type UseQueryOptions } from '@tanstack/react-query';
import { graphqlClient } from '@/api/graphqlClient';
import { queryKeys } from '@/api/queryKeys';
import { cleanGqlList } from '@/api/utils';
import { ProjectAccessibilityBadge } from '@/features/Mx/Acquisition/Project/AccessibilityBadge';
import { Calendar } from '@solar-icons/react';
import { NBSP } from '@/service/type';

export const ProjectCards: React.FC = () => {
    const options: UseQueryOptions<ProjectCardFragment[]> = useMemo(() => ({
        queryKey: queryKeys.mx.acquisition.project.all,
        queryFn: () => graphqlClient.request<AllProjectCardsQuery>(AllProjectCardsDocument, {})
            .then(data => cleanGqlList(data.allProjects?.results)),
    }), [])
    return <Card.Grid queryOptions={ options }
                      card={ ProjectCard }/>
}

export const ProjectCard: React.FC<ProjectCardFragment> = ({
                                                               id,
                                                               name,
                                                               projectType,
                                                               startDate,
                                                               endDate,
                                                               accessibility,
                                                           }) => {
    const type = useMemo(() => {
        if (!projectType) return null;
        return projectType.name[0].toUpperCase() + projectType.name.slice(1);
    }, [ projectType ])

    const startYear = useMemo(() => {
        if (!startDate) return null;
        return new Date(startDate).getFullYear();
    }, [ startDate ])

    const endYear = useMemo(() => {
        if (!endDate) return null;
        return new Date(endDate).getFullYear();
    }, [ endDate ])

    return <Card.Root to="/mx/acquisition/project/$id/$name"
                      params={ { id, name } }
                      preload={ false }>
        <Card.Head>
            <p>{ name }</p>
            <Note color="medium">{ type ?? NBSP }</Note>
        </Card.Head>

        <Card.Info>
            <Calendar weight="Linear" size={ 20 }/>
            { startYear ?? '...' } - { endYear ?? '...' }
        </Card.Info>

        <Card.Info>
            <ProjectAccessibilityBadge accessibility={ accessibility }/>
        </Card.Info>
    </Card.Root>
}