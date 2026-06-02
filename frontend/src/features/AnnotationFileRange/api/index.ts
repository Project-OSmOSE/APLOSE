import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    FileRangesForPhaseDocument,
    type FileRangesForPhaseQuery,
    type FileRangesForPhaseQueryVariables,
} from './annotation-file-range.generated'

export const forPhaseQuery = (variables: FileRangesForPhaseQueryVariables) => queryOptions({
    queryKey: queryKeys.fileRanges.forPhase(variables),
    queryFn: () => graphqlClient.request<FileRangesForPhaseQuery>(FileRangesForPhaseDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationFileRanges?.results)),
})

export type * from './annotation-file-range.generated'