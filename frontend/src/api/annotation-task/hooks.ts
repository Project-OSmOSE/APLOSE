import { AnnotationTaskGqlAPI } from './api';
import { useCallback, useMemo } from 'react';
import {
    AnnotationCommentInput,
    AnnotationInput,
    AnnotationPhaseType,
    type ListAnnotationTaskQueryVariables,
} from '@/api';
import { useLoaderData, useParams, useSearch } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { selectAnalysisID } from '@/features/Annotator/Analysis';
import { GetAnnotationTaskQueryVariables } from './annotation-task.generated'

export const PAGE_SIZE = 20;

// API

const {
    listAnnotationTask,
    getAnnotationTask,
    submitTask,
} = AnnotationTaskGqlAPI.endpoints

export type AllTasksFilters =
    Pick<ListAnnotationTaskQueryVariables, 'search' | 'status' | 'from' | 'to' | 'withAnnotations' | 'annotationLabel' | 'annotationConfidence' | 'annotationDetector' | 'annotationAnnotator' | 'withAcousticFeatures' | 'onlyAssigned'>
    & {
    page: number
}

export const useAllAnnotationTasks = (filters: AllTasksFilters, options: {
    refetchOnMountOrArgChange?: boolean
} = {}) => {
    const { phaseType } = useParams({ strict: false });
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { user } = useLoaderData({ from: '/_authenticated' })

    const info = listAnnotationTask.useQuery({
        ...filters,
        campaignID: campaign.id,
        phaseType: phaseType ?? AnnotationPhaseType.Annotation,
        annotatorID: user.id,
        limit: PAGE_SIZE,
        offset: PAGE_SIZE * ((filters.page ?? 1) - 1),
    }, {
        skip: !phaseType || campaign.isArchived,
        ...options,
    })
    return useMemo(() => ({
        ...info,
        allSpectrograms: info.data?.allAnnotationSpectrograms?.results.filter(r => r !== null),
        resumeSpectrogramID: info.data?.allAnnotationSpectrograms?.resumeSpectrogramId,
        page: filters.page,
        pageCount: Math.ceil((info.data?.allAnnotationSpectrograms?.totalCount ?? 0) / PAGE_SIZE),
    }), [ info, filters.page ])
}

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
