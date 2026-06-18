import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { ListLabelSetsDocument, type ListLabelSetsQuery } from './label.generated'
import { cleanGqlList } from '@/api/utils';


export const allQuery = queryOptions({
    queryKey: queryKeys.label.allSets,
    queryFn: () => graphqlClient.request<ListLabelSetsQuery>(ListLabelSetsDocument, {})
        .then(data => cleanGqlList(data.allLabelSets?.results)),
})

export type * from './label.generated'
