import { createSelector } from '@reduxjs/toolkit';
import type { AppState } from '@/features/App';
import { selectCampaign, selectTask } from '@/api';
import { AnnotatorSlice } from './slice'

export const selectAnnotator = (state: AppState) => state.annotator

export const selectCampaignID = createSelector(
    selectAnnotator, AnnotatorSlice.selectors.selectCampaignID,
)
export const selectTaskVariables = createSelector(
    selectAnnotator, AnnotatorSlice.selectors.selectTaskVariables,
)

export const selectAnnotatorCampaign = createSelector(
    [
        (state: AppState) => state,
        selectCampaignID,
    ],
    (state, campaignID) => selectCampaign(state, campaignID ?? ''),
)


export const selectAnnotationTask = createSelector(
    [
        (state: AppState) => state,
        selectTaskVariables,
    ],
    (state, variables) => selectTask(state, variables!),
)

export const selectTaskIsEditionAuthorized = createSelector(
    selectAnnotationTask,
    (taskQuery) => taskQuery.data?.annotationSpectrogramById?.isAssigned,
)
