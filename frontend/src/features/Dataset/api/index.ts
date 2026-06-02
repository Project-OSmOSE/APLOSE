import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { AllDatasetsDocument, type AllDatasetsQuery } from './dataset.generated';
import { cleanGqlList } from '@/api/utils';

export const allQuery = queryOptions({
    queryKey: queryKeys.dataset.all,
    queryFn: () => graphqlClient.request<AllDatasetsQuery>(AllDatasetsDocument, {})
        .then(data => cleanGqlList(data.allDatasets?.results)),
})

export type * from './dataset.generated'
