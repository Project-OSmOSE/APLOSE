import { createSelector } from '@reduxjs/toolkit';
import { selectAnnotator, selectAnnotatorCampaign } from '@/features/Annotator/selectors';
import { AnnotatorLabelSlice } from './slice';


export const selectHiddenLabels = createSelector(
  selectAnnotator, AnnotatorLabelSlice.selectors.selectHiddenLabels,
)

export const selectFocusLabel = createSelector(
  selectAnnotator, AnnotatorLabelSlice.selectors.selectFocus,
)

export const selectAllLabels = createSelector(
  selectAnnotatorCampaign,
  (campaignQuery) => campaignQuery.data?.annotationCampaignById?.labelSet?.labels.filter(l => !!l).map(l => l!.name) ?? [],
)
