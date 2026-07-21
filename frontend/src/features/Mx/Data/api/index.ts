import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllFormatsDocument,
    type AllFormatsQuery,
    CreateFormatDocument,
    type CreateFormatMutation,
    type CreateFormatMutationVariables,
} from './Data.generated';

export const allFormatsQuery = queryOptions({
    queryKey: queryKeys.mx.data.allFormats,
    queryFn: () => graphqlClient.request<AllFormatsQuery>(AllFormatsDocument, {})
        .then(data => cleanGqlList(data.allFileFormats?.results)),
})

export const createFormat = optimisticMutationOptions({
    mutationKey: queryKeys.mx.data.allFormats,
    mutationFn: (input: CreateFormatMutationVariables['input']) => graphqlClient.request<CreateFormatMutation>(CreateFormatDocument, { input })
        .then(data => data.fileFormat),
})

export type * from './Data.generated';
