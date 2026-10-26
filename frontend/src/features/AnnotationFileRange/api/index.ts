import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    CreateFileRangeDocument,
    type CreateFileRangeMutation,
    type CreateFileRangeMutationVariables,
    DeleteFileRangeDocument,
    type DeleteFileRangeMutation,
    type DeleteFileRangeMutationVariables,
    type FileRangeFragment,
    ListFileRangesDocument,
    type ListFileRangesQuery,
    type ListFileRangesQueryVariables,
    UpdateFileRangeDocument,
    type UpdateFileRangeMutation,
    type UpdateFileRangeMutationVariables,
} from './annotation-file-range.generated'

export const listFileRanges = (variables: ListFileRangesQueryVariables) => queryOptions({
    queryKey: queryKeys.fileRange.list(variables),
    queryFn: () => graphqlClient.request<ListFileRangesQuery>(ListFileRangesDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationFileRanges?.results).map(data => ({
            ...data,
            lastFileIndex: data.lastFileIndex + 1,
            firstFileIndex: data.firstFileIndex + 1,
        }))),
})

export const createMutation = mutationOptions({
    mutationFn: (variables: Omit<CreateFileRangeMutationVariables['input'], 'id' | 'clientMutationId'>) =>
        graphqlClient.request<CreateFileRangeMutation>(CreateFileRangeDocument, {
            input: {
                ...variables,
                firstFileIndex: variables.firstFileIndex - 1,
                lastFileIndex: variables.lastFileIndex - 1,
            }
        }),
    onSettled: (_data, _error, { annotationPhase }, _onMutateResult, context) =>
        context.client.invalidateQueries({ queryKey: queryKeys.fileRange.list({ phaseID: annotationPhase }) }),
})

export const updateMutation = mutationOptions({
    mutationFn: (variables: Omit<UpdateFileRangeMutationVariables['input'], 'clientMutationId'> & { annotationPhase: string }) =>
        graphqlClient.request<UpdateFileRangeMutation>(UpdateFileRangeDocument, {
        input: {
            id: variables.id,
            firstFileIndex: variables.firstFileIndex - 1,
            lastFileIndex: variables.lastFileIndex - 1,
        },
    }),
    onSettled: (_data, _error, { annotationPhase }, _onMutateResult, context) =>
        context.client.invalidateQueries({ queryKey: queryKeys.fileRange.list({ phaseID: annotationPhase }) }),
})

export const deleteMutation = mutationOptions({
    mutationFn: (variables: DeleteFileRangeMutationVariables & {
        phaseID: string
        annotatorID: string
    }) => graphqlClient.request<DeleteFileRangeMutation>(DeleteFileRangeDocument, variables),
    onMutate: async ({ phaseID, id: fileRangeID }, context) => {
        const queryKey = queryKeys.fileRange.list({ phaseID })
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await context.client.cancelQueries({ queryKey })

        // Snapshot the previous value
        const previousRanges = context.client.getQueryData(queryKey)

        // Optimistically update to the new value
        context.client.setQueryData(queryKey, (old: FileRangeFragment[]) => old.filter(fr => fr.id !== fileRangeID))

        // Return a result with the snapshotted value
        return { previousRanges }
    },
    // If the mutation fails, use the result returned from onMutate to roll back
    onError: (_err, { phaseID }, onMutateResult, context) => {
        context.client.setQueryData(queryKeys.fileRange.list({ phaseID }), onMutateResult?.previousRanges)
    },
    // Always refetch after error or success:
    onSettled: (_data, _error, { phaseID }, _onMutateResult, context) =>
        context.client.invalidateQueries({ queryKey: queryKeys.fileRange.list({ phaseID }) }),
})

export type * from './annotation-file-range.generated'