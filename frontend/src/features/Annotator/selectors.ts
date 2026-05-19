import { createSelector } from '@reduxjs/toolkit';
import type { AppState } from '@/features/App';
import { selectCampaign, selectTask } from '@/api';
import { AnnotatorSlice } from './slice'

export const selectCampaignID = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorSlice.selectors.selectCampaignID,
)
export const selectTaskVariables = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorSlice.selectors.selectTaskVariables,
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
