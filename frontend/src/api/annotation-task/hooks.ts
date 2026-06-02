import { AnnotationTaskGqlAPI } from './api';
import { useCallback, useMemo } from 'react';
import { AnnotationCommentInput, AnnotationInput } from '@/api';
import { useLoaderData, useParams } from '@tanstack/react-router';

// API

const {
    submitTask,
} = AnnotationTaskGqlAPI.endpoints

export const useSubmitTask = () => {
    const { campaignID, spectrogramID } = useParams({ strict: false });
    const { phase } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType' })
    const [ method, info ] = submitTask.useMutation()

    const submit = useCallback(async (annotations: AnnotationInput[],
                                      taskComments: AnnotationCommentInput[],
                                      start: Date) => {
        if (!campaignID || !spectrogramID) return;
        await method({
            campaignID,
            phase: phase.phase,
            spectrogramID,
            annotations,
            taskComments,
            startedAt: start.toISOString(),
            endedAt: new Date().toISOString(),
        }).unwrap()
    }, [ method, campaignID, spectrogramID, phase ]);

    return useMemo(() => {
        const error = info.error ?? info.data?.submitAnnotationTask?.annotationErrors ?? info.data?.submitAnnotationTask?.taskCommentsErrors;
        return {
            ...info,
            submitTask: submit,
            isSuccess: info.isSuccess && !error,
            isError: !!error,
            error,
        }
    }, [ submit, info ])
}
