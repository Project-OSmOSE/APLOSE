import { GraphQLClient } from 'graphql-request';
import {
    type AllBibliographyQuery,
    type AllDeploymentsQuery,
    type AllNewsQuery,
    type AllProjectsQuery,
    type AllScientificTalksQuery,
    AllTeamMembersQuery,
    type DeploymentByIdQuery,
    getSdk,
    HomeCollaboratorsQuery,
    type NewsByIdQuery,
    type ProjectByIdQuery,
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

// Projects & Deployments
export type LightProject = N<N<N<AllProjectsQuery['allWebsiteProjects']>['results']>[number]>
export type Project = N<ProjectByIdQuery['websiteProjectById']>
export type LightDeployment = N<N<N<AllDeploymentsQuery['allDeployments']>['results']>[number]>
export type Deployment = N<DeploymentByIdQuery['deploymentById']>
export type DeploymentLabel = N<N<N<DeploymentByIdQuery['annotationLabelsForDeploymentId']>['results']>[number]>

// Bibliography
export type Bibliography = N<N<N<AllBibliographyQuery['allBibliography']>['edges'][number]>['node']>
export type Author = N<N<Bibliography['authors']['edges'][number]>['node']>
export type Article = Bibliography & { __typename: 'ArticleNode' }
export type Software = Bibliography & { __typename: 'SoftwareNode' }
export type Poster = Bibliography & { __typename: 'PosterNode' }
export type Conference = Bibliography & { __typename: 'ConferenceNode' }

// ScientificTalks
export type ScientificTalk = N<N<N<AllScientificTalksQuery['allScientificTalks']>['results']>[number]>
