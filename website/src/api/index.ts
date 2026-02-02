import { GraphQLClient } from 'graphql-request';
import { AllTeamMembersQuery, getSdk, TeamMemberByIdQuery } from './queries.generated';
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

// TeamMember
export type LightTeamMember = N<N<N<AllTeamMembersQuery['allTeamMembers']>['results']>[number]>
export type TeamMember = N<TeamMemberByIdQuery['teamMemberById']>
