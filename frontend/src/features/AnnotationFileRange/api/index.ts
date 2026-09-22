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
    FileRangesForPhaseDocument,
    type FileRangesForPhaseQuery,
    type FileRangesForPhaseQueryVariables,
    GetFileRangesDocument,
    type GetFileRangesQuery,
    type GetFileRangesQueryVariables,
    ListFileRangesDocument,
    type ListFileRangesQuery,
    type ListFileRangesQueryVariables,
    UpdateFileRangeDocument,
    type UpdateFileRangeMutation,
    type UpdateFileRangeMutationVariables,
    UpdateFileRangesDocument,
    type UpdateFileRangesMutation,
    type UpdateFileRangesMutationVariables,
} from './annotation-file-range.generated'
import { queryClient } from '@/api/queryClient';

// TODO: remove
export const forPhaseQuery = (variables: FileRangesForPhaseQueryVariables) => queryOptions({
    queryKey: queryKeys.fileRange.forPhase(variables),
    queryFn: () => graphqlClient.request<FileRangesForPhaseQuery>(FileRangesForPhaseDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationFileRanges?.results).map(f => ({
            ...f,
            firstFileIndex: f.firstFileIndex + 1,
            lastFileIndex: f.lastFileIndex + 1,
        }))),
})

// TODO: remove
export const getFileRanges = (variables: GetFileRangesQueryVariables) => queryOptions({
    queryKey: queryKeys.fileRange.get(variables),
    queryFn: () => graphqlClient.request<GetFileRangesQuery>(GetFileRangesDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationFileRanges?.results).map(f => {
            const total = f.lastFileIndex - f.firstFileIndex;
            return {
                ...f,
                firstFileIndex: f.firstFileIndex + 1,
                lastFileIndex: f.lastFileIndex + 1,
                total,
                completionPercentage: (f.completedAnnotationTasks?.totalCount ?? 0) / total * 100,
            }
        })),
})

// TODO: remove
export const updateMultipleMutation = mutationOptions({
    mutationFn: (variables: UpdateFileRangesMutationVariables) => graphqlClient.request<UpdateFileRangesMutation>(UpdateFileRangesDocument, {
        ...variables,
        fileRanges: variables.fileRanges.map(f => ({
            id: (f.id && +f.id > -1) ? f.id : undefined,
            annotatorId: f.annotatorId,
            lastFileIndex: f.lastFileIndex - 1,
            firstFileIndex: f.firstFileIndex - 1,
        })),
    }),
    onSuccess: (_data, { campaignID, phaseType }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.fileRange.forPhase({ campaignID, phaseType }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: campaignID }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.phase.get({ campaignID, phase: phaseType }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
        queryClient.invalidateQueries({ queryKey: queryKeys.spectrogram.baseForPhase({ campaignID, phaseType }) })
    },
})

export const listFileRanges = (variables: ListFileRangesQueryVariables) => queryOptions({
    queryKey: queryKeys.fileRange.list(variables),
    queryFn: () => graphqlClient.request<ListFileRangesQuery>(ListFileRangesDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationFileRanges?.results)),
})

export const createMutation = mutationOptions({
    mutationFn: (variables: {
        phaseID: string
        annotatorID: string
        annotatorDisplayName: string
        input: Omit<CreateFileRangeMutationVariables['input'], 'annotator' | 'annotationPhase'>
    }) => graphqlClient.request<CreateFileRangeMutation>(CreateFileRangeDocument, {
        input: {
            ...variables.input,
            annotator: variables.annotatorID,
            annotationPhase: variables.phaseID,
        },
    }),
    onMutate: async ({ phaseID, input: { firstFileIndex, lastFileIndex }, annotatorID, annotatorDisplayName }, context) => {
        const queryKey = queryKeys.fileRange.list({ phaseID })
        // Cancel any outgoing refetches
        // (so they don't overwrite our optimistic update)
        await context.client.cancelQueries({ queryKey })

        // Snapshot the previous value
        const previousRanges = context.client.getQueryData(queryKey)

        // Optimistically update to the new value
        context.client.setQueryData(queryKey, (old: FileRangeFragment[]) => [ ...old, {
            id: '-1',
            firstFileIndex,
            lastFileIndex,
            filesCount: lastFileIndex - firstFileIndex,
            annotator: {
                id: annotatorID,
                displayName: annotatorDisplayName
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
    }) => graphqlClient.request<UpdateFileRangeMutation>(UpdateFileRangeDocument, variables),
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
            firstFileIndex,
            lastFileIndex,
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