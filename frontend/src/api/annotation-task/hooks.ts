import { AnnotationTaskGqlAPI } from './api';
import { useCallback, useEffect, useMemo } from 'react';
import {
  AnnotationCommentInput,
  AnnotationInput,
  AnnotationPhaseType,
  useCurrentCampaign,
  useCurrentPhase,
  useCurrentUser,
} from '@/api';
import { AllAnnotationTaskFilterSlice, AllTasksFilters, selectAllTaskFilters } from './all-tasks-filters';
import { type AploseNavParams, useQueryParams } from '@/features/UX';
import { useParams } from 'react-router-dom';
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

export const useAllAnnotationTasks = (filters: AllTasksFilters, options: {
  refetchOnMountOrArgChange?: boolean
} = {}) => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
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
  }), [ info ])
}

export const useGetAnnotationTaskParams = (): GetAnnotationTaskQueryVariables => {
  const { campaignID, phaseType, spectrogramID } = useParams<AploseNavParams>();
  const analysisID = useAppSelector(selectAnalysisID)
  const { user } = useCurrentUser();
  const { params } = useAllTasksFilters()

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
    navigationInfo: info.data?.allAnnotationSpectrograms,
    annotations: [
      ...info.data?.annotationSpectrogramById?.task?.userAnnotations?.results ?? [],
      ...info.data?.annotationSpectrogramById?.task?.annotationsToCheck?.results ?? [],
    ].filter(r => !!r).map(r => r!),
  }), [ info, phase ])
}

export const useSubmitTask = () => {
  const { campaignID, phaseType, spectrogramID } = useParams<AploseNavParams>();
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
      error
    }
  }, [ submit, info ])
}


// Filters

export const useAllTasksFilters = ({ clearOnLoad }: { clearOnLoad: boolean } = { clearOnLoad: false }) => {
  const { params, updateParams, clearParams } = useQueryParams<AllTasksFilters>(
    selectAllTaskFilters,
    AllAnnotationTaskFilterSlice.actions.updateTaskFilters,
  )

  useEffect(() => {
    if (!clearOnLoad) return;
    updateParams(params)
  }, []);

  return {
    params,
    updateParams: useCallback((p: Omit<AllTasksFilters, 'page'>) => {
      updateParams({ ...p, page: 1 })
    }, [ updateParams ]),
    updatePage: useCallback((page: number) => {
      updateParams({ page })
    }, [ updateParams ]),
    clearParams: useCallback(() => {
      clearParams()
      updateParams({ page: 1 })
    }, [ clearParams ]),
  }
}
