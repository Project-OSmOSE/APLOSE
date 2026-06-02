import { AnnotationTaskGqlAPI } from './api';
import { useCallback, useMemo } from 'react';
import { AnnotationCommentInput, AnnotationInput, AnnotationPhaseType } from '@/api';
import { useLoaderData, useParams, useSearch } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { selectAnalysisID } from '@/features/Annotator/Analysis';
import { GetAnnotationTaskQueryVariables } from './annotation-task.generated'

// API

const {
    getAnnotationTask,
    submitTask,
} = AnnotationTaskGqlAPI.endpoints

export const useGetAnnotationTaskParams = (): GetAnnotationTaskQueryVariables => {
    const { campaignID, phaseType, spectrogramID } = useParams({
        strict: false,
        select: ({ campaignID, phaseType, spectrogramID }) => ({ campaignID, phaseType, spectrogramID }),
    });
    const analysisID = useAppSelector(selectAnalysisID)
    const { user } = useLoaderData({ from: '/_authenticated' })
    const params = useSearch({
        strict: false,
    });

    return useMemo(() => ({
        ...params,
        spectrogramID: spectrogramID ?? '',
        campaignID: campaignID ?? '',
        phaseType: phaseType ?? AnnotationPhaseType.Annotation,
        annotatorID: user.id,
        analysisID: analysisID ?? '',
    }), [ params, campaignID, phaseType, spectrogramID, user, analysisID ])
}

export const useAnnotationTask = (options: {
    refetchOnMountOrArgChange?: boolean,
} = {}) => {
    const params = useGetAnnotationTaskParams()

    const info = getAnnotationTask.useQuery(params, {
        ...options,
        skip: !params.annotatorID || !params.campaignID || !params.spectrogramID || !params.phaseType || !params.analysisID,
    })
    return useMemo(() => ({
        ...info,
        spectrogram: info.data?.annotationSpectrogramById,
        paths: info.data?.spectrogramPaths,
        navigationInfo: info.data?.allAnnotationSpectrograms,
        annotations: [
            ...info.data?.annotationSpectrogramById?.task?.userAnnotations?.results ?? [],
            ...info.data?.annotationSpectrogramById?.task?.annotationsToCheck?.results ?? [],
        ].filter(r => !!r).map(r => r!),
    }), [ info ])
}

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
