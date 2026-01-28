import { GraphQLClient } from "graphql-request";
import { AllBibliographyQuery, AllDeploymentsQuery, DeploymentByIdQuery, getSdk } from "./queries.generated";
import { useMemo } from "react";


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

// Deployments
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
