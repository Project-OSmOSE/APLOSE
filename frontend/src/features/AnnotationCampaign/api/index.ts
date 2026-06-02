import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    AllCampaignsDocument,
    type AllCampaignsQuery,
    type AllCampaignsQueryVariables,
    ArchiveCampaignDocument,
    type ArchiveCampaignMutation,
    type ArchiveCampaignMutationVariables,
    CreateCampaignDocument,
    type CreateCampaignMutation,
    type CreateCampaignMutationVariables,
    GetCampaignDocument,
    type GetCampaignQuery,
    type GetCampaignQueryVariables,
    UpdateCampaignFeaturedLabelsDocument,
    type UpdateCampaignFeaturedLabelsMutation,
    type UpdateCampaignFeaturedLabelsMutationVariables,
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


export const archiveMutation = mutationOptions({
    mutationFn: (variables: ArchiveCampaignMutationVariables) => graphqlClient.request<ArchiveCampaignMutation>(ArchiveCampaignDocument, variables),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: variables.id }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
    },
})

export const updateFeaturedLabelsMutation = mutationOptions({
    mutationFn: (variables: UpdateCampaignFeaturedLabelsMutationVariables) => graphqlClient.request<UpdateCampaignFeaturedLabelsMutation>(UpdateCampaignFeaturedLabelsDocument, variables),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: variables.id }) })
    },
})


export type * from './annotation-campaign.generated'
