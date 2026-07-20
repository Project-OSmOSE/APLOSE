import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import { AllLabelsDocument, type AllLabelsQuery } from './Ontology.generated';

export const allLabels = queryOptions({
    queryKey: queryKeys.mx.ontology.allLabels,
    queryFn: () => graphqlClient.request<AllLabelsQuery>(AllLabelsDocument, {})
        .then(data => cleanGqlList(data.allLabels?.results)),
})

export type * from './Ontology.generated';
