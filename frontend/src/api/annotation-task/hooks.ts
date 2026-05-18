import { AnnotationTaskGqlAPI } from './api';
import { useCallback, useMemo } from 'react';
import {
    AnnotationCommentInput,
    AnnotationInput,
    AnnotationPhaseType,
    type ListAnnotationTaskQueryVariables,
    useCurrentCampaign,
    useCurrentPhase,
    useCurrentUser,
} from '@/api';
import { useParams, useSearch } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { selectAnalysisID } from '@/features/Annotator/Analysis';
import { GetAnnotationTaskQueryVariables } from './annotation-task.generated'

const PAGE_SIZE = 20;

// API

const {
    listAnnotationTask,
    getAnnotationTask,
    submitTask,
} = AnnotationTaskGqlAPI.endpoints

export type AllTasksFilters =
    Pick<ListAnnotationTaskQueryVariables, 'search' | 'status' | 'from' | 'to' | 'withAnnotations' | 'annotationLabel' | 'annotationConfidence' | 'annotationDetector' | 'annotationAnnotator' | 'withAcousticFeatures'>
    & {
    page: number
}

export const useAllAnnotationTasks = (filters: AllTasksFilters, options: {
    refetchOnMountOrArgChange?: boolean
} = {}) => {
    const { campaignID, phaseType } = useParams({ strict: false });
    const { campaign } = useCurrentCampaign()
    const { user } = useCurrentUser();

    const info = listAnnotationTask.useQuery({
        ...filters,
        campaignID: campaignID ?? '',
        phaseType: phaseType ?? AnnotationPhaseType.Annotation,
        annotatorID: user?.id ?? '',
        limit: PAGE_SIZE,
        offset: PAGE_SIZE * ((filters.page ?? 1) - 1),
    }, {
        skip: !user || !campaignID || !phaseType || campaign?.isArchived,
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
    const { campaignID, phaseType, spectrogramID } = useParams({ strict: false });
    const analysisID = useAppSelector(selectAnalysisID)
    const { user } = useCurrentUser();
    const params = useSearch({ strict: false });

    return useMemo(() => ({
        ...params,
        spectrogramID: spectrogramID ?? '',
        campaignID: campaignID ?? '',
        phaseType: phaseType ?? AnnotationPhaseType.Annotation,
        annotatorID: user?.id ?? '',
        analysisID: analysisID ?? '',
    }), [ params, campaignID, phaseType, spectrogramID, user, analysisID ])
}

export const useAnnotationTask = (options: {
    refetchOnMountOrArgChange?: boolean,
} = {}) => {
    const { phase } = useCurrentPhase()
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
    }), [ info, phase ])
}

export const useSubmitTask = () => {
    const { campaignID, phaseType, spectrogramID } = useParams({ strict: false });
    const { phase } = useCurrentPhase()
    const [ method, info ] = submitTask.useMutation()

    const submit = useCallback(async (annotations: AnnotationInput[],
                                      taskComments: AnnotationCommentInput[],
                                      start: Date) => {
        if (!campaignID || !phaseType || !spectrogramID) return;
        await method({
            campaignID,
            phase: phaseType,
            spectrogramID,
            annotations,
            taskComments,
            startedAt: start.toISOString(),
            endedAt: new Date().toISOString(),
        }).unwrap()
    }, [ method, campaignID, phaseType, spectrogramID, phase ]);

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
