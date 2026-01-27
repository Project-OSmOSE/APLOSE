import { GraphQLClient } from "graphql-request";
import { AllDeploymentsQuery, DeploymentByIdQuery, getSdk } from "./queries.generated";
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
