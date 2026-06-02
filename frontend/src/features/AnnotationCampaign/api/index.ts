import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    AllCampaignsDocument,
    type AllCampaignsQuery,
    type AllCampaignsQueryVariables,
    CreateCampaignDocument,
    type CreateCampaignMutation,
    type CreateCampaignMutationVariables,
    GetCampaignDocument,
    type GetCampaignQuery,
    type GetCampaignQueryVariables,
} from './annotation-campaign.generated'
import { queryClient } from '@/api/queryClient';

export const allQuery = (variables: AllCampaignsQueryVariables) => queryOptions({
    queryKey: queryKeys.campaign.all(variables),
    queryFn: () => graphqlClient.request<AllCampaignsQuery>(AllCampaignsDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationCampaigns?.results)),
})

export const byIdQuery = (variables: GetCampaignQueryVariables) => queryOptions({
    queryKey: queryKeys.campaign.byId(variables),
    queryFn: () => graphqlClient.request<GetCampaignQuery>(GetCampaignDocument, variables)
        .then(data => ({
            campaign: data.annotationCampaignById,
            phases: cleanGqlList(data.annotationCampaignById?.phases?.results),
            analysis: cleanGqlList(data.annotationCampaignById?.analysis?.edges.map(e => e?.node)),
            confidences: cleanGqlList(data.annotationCampaignById?.confidenceSet?.confidenceIndicators),
            labels: cleanGqlList(data.annotationCampaignById?.labelSet?.labels),
        })),
})

export const createMutation = mutationOptions({
    mutationFn: (variables: CreateCampaignMutationVariables) => graphqlClient.request<CreateCampaignMutation>(CreateCampaignDocument, variables)
        .then(data => data.createAnnotationCampaign?.annotationCampaign),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base }),
})


export type * from './annotation-campaign.generated'
