import { mutationOptions } from '@tanstack/react-query';
import {
    SubmitTaskDocument,
    type SubmitTaskMutation,
    type SubmitTaskMutationVariables,
} from './annotation-task.generated';
import { graphqlClient } from '@/api/graphqlClient';
import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';

export const submitMutation = mutationOptions({
    mutationFn: (variables: SubmitTaskMutationVariables) => graphqlClient.request<SubmitTaskMutation>(SubmitTaskDocument, variables),
    onSuccess: (_data, { campaignID, phase, spectrogramID }) => {
        queryClient.invalidateQueries({ type: 'all', queryKey: queryKeys.spectrogram.get({ campaignID, phaseType: phase, spectrogramID }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.phase.get({ campaignID, phase }) })
    },
})

export type * from './annotation-task.generated'