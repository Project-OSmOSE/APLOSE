import { createSelector } from '@reduxjs/toolkit';
import { selectAnnotatorCampaign } from '@/features/Annotator/selectors';
import { AnnotatorLabelSlice } from './slice';
import type { AppState } from '@/features/App';


export const selectHiddenLabels = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorLabelSlice.selectors.selectHiddenLabels,
)

export const selectFocusLabel = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorLabelSlice.selectors.selectFocus,
)

export const selectAllLabels = createSelector(
    selectAnnotatorCampaign,
    (campaignQuery) => campaignQuery.data?.annotationCampaignById?.labelSet?.labels.filter(l => !!l).map(l => l!.name) ?? [],
)
