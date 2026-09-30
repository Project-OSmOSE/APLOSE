import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllDatasetsDocument,
    type AllDatasetsQuery,
    AllDatasetsQueryVariables,
    AllDatasetsWithCampaignsDocument,
    type AllDatasetsWithCampaignsQuery,
    GetDatasetByIdDocument,
    type GetDatasetByIdQuery,
    type GetDatasetByIdQueryVariables,
} from './dataset.generated';
import { cleanGqlList } from '@/api/utils';

export const allQuery = (variables: AllDatasetsQueryVariables) => queryOptions({
    queryKey: queryKeys.dataset.all(variables),
    queryFn: () => graphqlClient.request<AllDatasetsQuery>(AllDatasetsDocument, variables)
        .then(data => cleanGqlList(data.allDatasets?.results)),
})

export const allWithCampaignsQuery = queryOptions({
    queryKey: queryKeys.dataset.allWithCampaigns,
    queryFn: () => graphqlClient.request<AllDatasetsWithCampaignsQuery>(AllDatasetsWithCampaignsDocument, {})
        .then(data => cleanGqlList(data.allDatasets?.results)),
})

export const byIdQuery = (variables: GetDatasetByIdQueryVariables) => queryOptions({
    queryKey: queryKeys.dataset.byId(variables),
    queryFn: () => graphqlClient.request<GetDatasetByIdQuery>(GetDatasetByIdDocument, variables)
        .then(data => ({
            dataset: data.datasetById,
            allChannelConfigurations: cleanGqlList(data.allChannelConfigurations?.results),
            analysis: cleanGqlList(data.allSpectrogramAnalysis?.results),
            campaigns: cleanGqlList(data.allAnnotationCampaigns?.results),
        })),
})

export type {
    AllDatasetsQuery as AllQuery,
    AllDatasetsQueryVariables as AllQueryVariables,

    DatasetFragment as Fragment,
} from './dataset.generated.ts'
