import { createSelector } from '@reduxjs/toolkit';
import { selectAnnotator, selectAnnotatorCampaign } from '@/features/Annotator/selectors';
import { AnnotatorConfidenceSlice } from './slice';


export const selectFocusConfidence = createSelector(
  selectAnnotator, AnnotatorConfidenceSlice.selectors.selectFocus,
)

export const selectConfidenceSet = createSelector(
  selectAnnotatorCampaign,
  (campaignQuery) => campaignQuery.data?.annotationCampaignById?.confidenceSet,
)

export const selectAllConfidences = createSelector(
  selectConfidenceSet,
  (confidenceSet) => confidenceSet?.confidenceIndicators?.filter(c => c !== null).map(c => c!) ?? [],
)
