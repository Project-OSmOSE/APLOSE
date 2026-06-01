import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    BrowseStorageDocument,
    type BrowseStorageQuery,
    type BrowseStorageQueryVariables,
    ImportDatasetFromStorageDocument,
    type ImportDatasetFromStorageMutation,
    type ImportDatasetFromStorageMutationVariables,
    SearchStorageDocument,
    type SearchStorageQuery,
    type SearchStorageQueryVariables,
} from './storage.generated';
import { cleanGqlList } from '@/api/utils';

export const browseQuery = (variables: BrowseStorageQueryVariables) => queryOptions({
    queryKey: queryKeys.storage.browse(variables),
    queryFn: () => graphqlClient.request<BrowseStorageQuery>(BrowseStorageDocument, variables)
        .then(data => cleanGqlList(data.browse)),
})

export const searchQuery = (variables: SearchStorageQueryVariables) => queryOptions({
    queryKey: queryKeys.storage.search(variables),
    queryFn: () => graphqlClient.request<SearchStorageQuery>(SearchStorageDocument, variables)
        .then(data => data.search),
})

export const importMutation = mutationOptions({
    mutationFn: (variables: ImportDatasetFromStorageMutationVariables) => graphqlClient.request<ImportDatasetFromStorageMutation>(ImportDatasetFromStorageDocument, variables),

    // TODO: invalidate datasets and analysis queries:
    //  invalidatesTags: [ 'Dataset', 'DatasetsAndAnalysis' ],

    // TODO: try to invalidate browse and search keys with given path
})

export type * from './storage.generated'