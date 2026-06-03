import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    FileRangesForPhaseDocument,
    type FileRangesForPhaseQuery,
    type FileRangesForPhaseQueryVariables,
    UpdateFileRangesDocument,
    type UpdateFileRangesMutation,
    type UpdateFileRangesMutationVariables,
} from './annotation-file-range.generated'
import { queryClient } from '@/api/queryClient';

export const forPhaseQuery = (variables: FileRangesForPhaseQueryVariables) => queryOptions({
    queryKey: queryKeys.fileRange.forPhase(variables),
    queryFn: () => graphqlClient.request<FileRangesForPhaseQuery>(FileRangesForPhaseDocument, variables)
        .then(data => cleanGqlList(data.allAnnotationFileRanges?.results).map(f => ({
            ...f,
            firstFileIndex: f.firstFileIndex + 1,
            lastFileIndex: f.lastFileIndex + 1,
        }))),
})

export const updateMutation = mutationOptions({
    mutationFn: (variables: UpdateFileRangesMutationVariables) => graphqlClient.request<UpdateFileRangesMutation>(UpdateFileRangesDocument, {
        ...variables,
        fileRanges: variables.fileRanges.map(f => ({
            id: (f.id && +f.id > -1) ? f.id : undefined,
            annotatorId: f.annotatorId,
            lastFileIndex: f.lastFileIndex - 1,
            firstFileIndex: f.firstFileIndex - 1,
        }))
    }),
    onSuccess: (_data, { campaignID, phaseType }) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.fileRange.forPhase({ campaignID, phaseType }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: campaignID }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.phase.get({ campaignID, phase: phaseType }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
        queryClient.invalidateQueries({ queryKey: queryKeys.spectrogram.baseForPhase({ campaignID, phaseType }) })
    },
})

export type * from './annotation-file-range.generated'