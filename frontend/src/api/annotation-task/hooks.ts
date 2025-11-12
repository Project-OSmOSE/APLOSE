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
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis/hooks';
import { type AploseNavParams, useQueryParams } from '@/features/UX';
import { useParams } from 'react-router-dom';

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

export const useAnnotationTask = (options: {
  refetchOnMountOrArgChange?: boolean,
} = {}) => {
  const { campaignID, phaseType, spectrogramID } = useParams<AploseNavParams>();
  const { analysisID } = useAnnotatorAnalysis()
  const { phase } = useCurrentPhase()
  const { params } = useAllTasksFilters()
  const { user } = useCurrentUser();

  const info = getAnnotationTask.useQuery({
    ...params,
    spectrogramID: spectrogramID ?? '',
    campaignID: campaignID ?? '',
    phaseType: phaseType ?? AnnotationPhaseType.Annotation,
    annotatorID: user?.id ?? '',
    analysisID: analysisID ?? '',
  }, {
    ...options,
    skip: !user || !campaignID || !spectrogramID || !phaseType || !analysisID,
  })
  return useMemo(() => ({
    ...info,
    spectrogram: info.data?.annotationSpectrogramById,
    navigationInfo: info.data?.allAnnotationSpectrograms,
    annotations: info.data?.annotationSpectrogramById?.task?.annotations?.results.filter(r => !!r).map(r => r!),
    isEditionAuthorized: info.data?.annotationSpectrogramById?.isAssigned,
  }), [ info, phase ])
}

export const useSubmitTask = () => {
  const { campaignID, phaseType, spectrogramID } = useParams<AploseNavParams>();
  const { phase } = useCurrentPhase()
  const [ method, info ] = submitTask.useMutation()

  const submit = useCallback(async (annotations: AnnotationInput[],
                                    taskComments: AnnotationCommentInput[],
                                    start: Date) => {
    console.debug('submit', phaseType)
    if (!campaignID || !phaseType || !spectrogramID) return;
    await method({
      campaignID,
      phase: phaseType,
      spectrogramID,
      annotations,
      taskComments,
      startedAt: start.toISOString(),
      endedAt: new Date().toISOString(),
      content: JSON.stringify({ annotations, taskComments }),
    }).unwrap()
  }, [ method, campaignID, phaseType, spectrogramID, phase ]);

  return useMemo(() => ({
    ...info,
    submitTask: submit,
  }), [ submit, info ])
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
