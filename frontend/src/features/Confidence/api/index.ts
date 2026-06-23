import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { ListConfidenceSetsDocument, type ListConfidenceSetsQuery } from './confidence.generated'
import { cleanGqlList } from '@/api/utils';


export const allSetsQuery = queryOptions({
    queryKey: queryKeys.confidence.allSets,
    queryFn: () => graphqlClient.request<ListConfidenceSetsQuery>(ListConfidenceSetsDocument, {})
        .then(data => cleanGqlList(data.allConfidenceSets?.results)),
})

export type * from './confidence.generated'
