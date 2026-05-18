import { createSelector } from '@reduxjs/toolkit';
import { selectAnnotatorCampaign } from '@/features/Annotator/selectors';
import { AnnotatorConfidenceSlice } from './slice';
import type { AppState } from '@/features/App';


export const selectFocusConfidence = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorConfidenceSlice.selectors.selectFocus,
)

export const selectDefaultConfidence = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorConfidenceSlice.selectors.selectDefault,
)

export const selectConfidenceSet = createSelector(
    selectAnnotatorCampaign,
    (campaignQuery) => campaignQuery.data?.annotationCampaignById?.confidenceSet,
)

export const selectAllConfidences = createSelector(
    selectConfidenceSet,
    (confidenceSet) => confidenceSet?.confidenceIndicators?.filter(c => c !== null).map(c => c!) ?? [],
)
