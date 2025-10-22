import { AnnotationTaskGqlAPI, AnnotationTaskRestAPI } from './api';
import { useCallback, useEffect, useMemo } from 'react';
import {
  AnnotationPhaseType,
  type PostAnnotation,
  type PostAnnotationComment,
  useCurrentCampaign,
  useCurrentPhase,
  useCurrentUser,
} from '@/api';
import { AllAnnotationTaskFilterSlice, AllTasksFilters, selectAllTaskFilters } from './all-tasks-filters';
import { useAnnotatorAnalysis } from '@/features/Annotator/Analysis/hooks';
import { gqlAPI } from '@/api/baseGqlApi';
import { useAppDispatch } from '@/features/App';
import { useNavParams, useQueryParams } from '@/features/UX';

const PAGE_SIZE = 20;

// API

const {
  listAnnotationTask,
  getAnnotationTask,
} = AnnotationTaskGqlAPI.endpoints
const {
  submitTask,
} = AnnotationTaskRestAPI.endpoints

export const useAllAnnotationTasks = (filters: AllTasksFilters, options: {
  refetchOnMountOrArgChange?: boolean
} = {}) => {
  const { campaignID, phaseType } = useNavParams();
  const { campaign } = useCurrentCampaign()
  const { user } = useCurrentUser();

  const info = listAnnotationTask.useQuery({
    ...filters,
    campaignID: campaignID ?? '',
    phaseType: phaseType ?? AnnotationPhaseType.Annotation,
    annotatorID: user?.id ?? '',
    limit: PAGE_SIZE,
    offset: PAGE_SIZE * (filters.page - 1),
  }, {
    skip: !user || !campaignID || !phaseType || campaign?.isArchived,
    ...options,
  })
  return useMemo(() => ({
    ...info,
    allSpectrograms: info.data?.listAnnotationSpectrogram?.results.filter(r => r !== null),
    resumeSpectrogramID: info.data?.listAnnotationSpectrogram?.resumeSpectrogramId,
    page: filters.page,
    pageCount: Math.ceil((info.data?.listAnnotationSpectrogram?.totalCount ?? 0) / PAGE_SIZE),
  }), [ info ])
}

export const useAnnotationTask = (options: {
  refetchOnMountOrArgChange?: boolean,
} = {}) => {
  const { campaignID, phaseType, spectrogramID } = useNavParams();
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
    navigationInfo: info.data?.listAnnotationSpectrogram,
    annotations: info.data?.annotationSpectrogramById?.annotations?.results.filter(r => !!r).map(r => r!),
    isEditionAuthorized: phase?.canManage && info.data?.annotationSpectrogramById?.isAssigned,
  }), [ info, phase ])
}

export const useSubmitTask = () => {
  const { campaignID, phaseType, spectrogramID } = useNavParams();
  const { phase } = useCurrentPhase()
  const [ method, info ] = submitTask.useMutation()
  const dispatch = useAppDispatch()

  const submit = useCallback(async (annotations: PostAnnotation[],
                                    taskComments: PostAnnotationComment[],
                                    start: Date) => {
    if (!campaignID || !phaseType || !spectrogramID) return;
    await method({ campaignID, phaseType, spectrogramID, annotations, taskComments, start }).unwrap()
    dispatch(gqlAPI.util.invalidateTags([ {
      type: 'AnnotationPhase',
      id: phase?.id,
    } ]))
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
