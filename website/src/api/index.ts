import { GraphQLClient } from 'graphql-request';
import { AllTeamMembersQuery, getSdk, HomeCollaboratorsQuery, TeamMemberByIdQuery } from './queries.generated';
import {
    type AllNewsQuery,
    AllTeamMembersQuery,
    getSdk,
    HomeCollaboratorsQuery,
    type NewsByIdQuery,
    TeamMemberByIdQuery,
} from './queries.generated';
import { useMemo } from 'react';


export const useGqlSdk = () => {
    const client = useMemo(() => new GraphQLClient(
        `${ window.location.origin }/api/graphql`,
        {
            headers: {
                'Content-Type': 'application/json',
            }
        }
    ), [])
    return getSdk(client)
}

type N<T> = NonNullable<T>

// Home
export type Collaborator = N<N<N<HomeCollaboratorsQuery['allCollaborators']>['results']>[number]>

// TeamMember
export type LightTeamMember = N<N<N<AllTeamMembersQuery['allTeamMembers']>['results']>[number]>
export type TeamMember = N<TeamMemberByIdQuery['teamMemberById']>

// News
export type LightNews = N<N<N<AllNewsQuery['allNews']>['results']>[number]>
export type News = N<NewsByIdQuery['newsById']>
