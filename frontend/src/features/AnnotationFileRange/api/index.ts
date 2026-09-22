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
    mutationFn: (variables: {
        phaseID: string
        annotatorID: string
        annotatorDisplayName: string
        input: Omit<CreateFileRangeMutationVariables['input'], 'annotator' | 'annotationPhase'>
    }) => graphqlClient.request<CreateFileRangeMutation>(CreateFileRangeDocument, {
        input: {
            annotator: variables.annotatorID,
            annotationPhase: variables.phaseID,
            firstFileIndex: variables.input.firstFileIndex - 1,
            lastFileIndex: variables.input.lastFileIndex - 1,
        },
    }),
    onMutate: async ({
                         phaseID,
                         input: { firstFileIndex, lastFileIndex },
                         annotatorID,
                         annotatorDisplayName,
                     }, context) => {
        const queryKey = queryKeys.fileRange.list({ phaseID })
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await context.client.cancelQueries({ queryKey })

        // Snapshot the previous value
        const previousRanges = context.client.getQueryData(queryKey)

        // Optimistically update to the new value
        context.client.setQueryData(queryKey, (old: FileRangeFragment[]) => [ ...old, {
            id: '-1',
            firstFileIndex: firstFileIndex - 1,
            lastFileIndex: lastFileIndex - 1,
            filesCount: lastFileIndex - firstFileIndex,
            annotator: {
                id: annotatorID,
                displayName: annotatorDisplayName,
            },
        } satisfies FileRangeFragment ])

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

export const updateMutation = mutationOptions({
    mutationFn: (variables: UpdateFileRangeMutationVariables & {
        phaseID: string
        annotatorID: string
    }) => graphqlClient.request<UpdateFileRangeMutation>(UpdateFileRangeDocument, {
        input: {
            id: variables.input.id,
            firstFileIndex: variables.input.firstFileIndex - 1,
            lastFileIndex: variables.input.lastFileIndex - 1,
        },
    }),
    onMutate: async ({ phaseID, input: { id: fileRangeID, firstFileIndex, lastFileIndex } }, context) => {
        const queryKey = queryKeys.fileRange.list({ phaseID })
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await context.client.cancelQueries({ queryKey })

        // Snapshot the previous value
        const previousRanges = context.client.getQueryData(queryKey)

        // Optimistically update to the new value
        context.client.setQueryData(queryKey, (old: FileRangeFragment[]) => old.map(fr => fr.id === fileRangeID ? {
            ...fr,
            firstFileIndex: firstFileIndex - 1,
            lastFileIndex: lastFileIndex - 1,
        } : fr))

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