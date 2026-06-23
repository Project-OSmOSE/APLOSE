import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { ListDetectorsDocument, type ListDetectorsQuery } from './detector.generated'
import { cleanGqlList } from '@/api/utils';


export const allQuery = queryOptions({
    queryKey: queryKeys.label.allSets,
    queryFn: () => graphqlClient.request<ListDetectorsQuery>(ListDetectorsDocument, {})
        .then(data => cleanGqlList(data.allDetectors?.results)),
})

export type * from './detector.generated'
