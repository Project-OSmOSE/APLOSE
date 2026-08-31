import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllInstitutionsDocument,
    type AllInstitutionsQuery,
    AllPersonsDocument,
    type AllPersonsQuery,
    AllTeamsDocument,
    type AllTeamsQuery,
    type AllTeamsQueryVariables,
    CreateInstitutionDocument,
    type CreateInstitutionMutation,
    type CreateInstitutionMutationVariables,
    CreatePersonDocument,
    type CreatePersonMutation,
    type CreatePersonMutationVariables,
    CreateTeamDocument,
    type CreateTeamMutation,
    type CreateTeamMutationVariables,
    type InstitutionFragment,
    type PersonFragment,
    type TeamFragment,
} from './common.generated';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';

export const allInstitutionsQuery = queryOptions({
    queryKey: queryKeys.mx.common.allInstitutions,
    queryFn: () => graphqlClient.request<AllInstitutionsQuery>(AllInstitutionsDocument, {})
        .then(data => cleanGqlList(data.allInstitutions?.results)),
})

export const allTeamsQuery = queryOptions({
    queryKey: queryKeys.mx.common.allTeams,
    queryFn: () => graphqlClient.request<AllTeamsQuery>(AllTeamsDocument, {})
        .then(data => cleanGqlList(data.allTeams?.results)),
})

export const institutionTeamsQuery = (vars: Pick<AllTeamsQueryVariables, 'institutionId'>) => queryOptions({
    queryKey: queryKeys.mx.common.institutionTeams(vars.institutionId),
    enabled: !!vars.institutionId,
    queryFn: () => graphqlClient.request<AllTeamsQuery>(AllTeamsDocument, vars)
        .then(data => cleanGqlList(data.allTeams?.results)),
})

export const allPersonsQuery = queryOptions({
    queryKey: queryKeys.mx.common.allPersons,
    queryFn: () => graphqlClient.request<AllPersonsQuery>(AllPersonsDocument, {})
        .then(data => cleanGqlList(data.allPersons?.results)),
})

export const createInstitution = optimisticMutationOptions({
    mutationKey: queryKeys.mx.common.allInstitutions,
    mutationFn: (input: CreateInstitutionMutationVariables['input']) => graphqlClient.request<CreateInstitutionMutation>(CreateInstitutionDocument, { input })
        .then(data => data.institution),
})

export const createTeam = optimisticMutationOptions({
    mutationKey: queryKeys.mx.common.allTeams,
    mutationFn: (input: CreateTeamMutationVariables['input']) => graphqlClient.request<CreateTeamMutation>(CreateTeamDocument, { input })
        .then(data => data.team),
})

export const createPerson = optimisticMutationOptions({
    mutationKey: queryKeys.mx.common.allPersons,
    mutationFn: (input: CreatePersonMutationVariables['input']) => graphqlClient.request<CreatePersonMutation>(CreatePersonDocument, { input })
        .then(data => data.createPerson),
})

export type ContactFragment = PersonFragment | TeamFragment | InstitutionFragment
export type * from './common.generated'