import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    AllSpectrogramAnalysisDocument,
    AllSpectrogramAnalysisForDatasetDocument,
    type AllSpectrogramAnalysisForDatasetQuery,
    type AllSpectrogramAnalysisForDatasetQueryVariables,
    type AllSpectrogramAnalysisQuery,
    type AllSpectrogramAnalysisQueryVariables,
} from './spectrogram-analysis.generated'

export const allQuery = (variables: AllSpectrogramAnalysisQueryVariables) => queryOptions({
    queryKey: queryKeys.analysis.all(variables),
    queryFn: () => graphqlClient.request<AllSpectrogramAnalysisQuery>(AllSpectrogramAnalysisDocument, variables)
        .then(data => cleanGqlList(data.allSpectrogramAnalysis?.results)),
})

export const allForDatasetQuery = (variables: AllSpectrogramAnalysisForDatasetQueryVariables) => queryOptions({
    queryKey: queryKeys.analysis.allForDataset(variables),
    queryFn: () => graphqlClient.request<AllSpectrogramAnalysisForDatasetQuery>(AllSpectrogramAnalysisForDatasetDocument, variables)
        .then(data => cleanGqlList(data.allSpectrogramAnalysis?.results)),
})

export type * from './spectrogram-analysis.generated'