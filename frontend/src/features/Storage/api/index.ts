import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { BrowseStorageDocument, type BrowseStorageQuery, type BrowseStorageQueryVariables } from './storage.generated';
import { cleanGqlList } from '@/api/utils';

export const browseQuery = (variables: BrowseStorageQueryVariables) => queryOptions({
    queryKey: queryKeys.storage.browse(variables),
    queryFn: () => graphqlClient.request<BrowseStorageQuery>(BrowseStorageDocument, variables)
        .then(data => cleanGqlList(data.browse)),
})

export type * from './storage.generated'