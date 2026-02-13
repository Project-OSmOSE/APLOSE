import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorAnalysisSlice } from './slice'
import { selectAnnotator, selectAnnotatorCampaign } from '@/features/Annotator/selectors';


export const selectAnalysisID = createSelector(
  selectAnnotator, AnnotatorAnalysisSlice.selectors.selectID,
)

export const selectFFT = createSelector(
  selectAnnotator, AnnotatorAnalysisSlice.selectors.selectFFT,
)


export const selectAllAnalysis = createSelector(
  selectAnnotatorCampaign,
  (campaignQuery) =>
    campaignQuery.data?.annotationCampaignById?.analysis.edges.filter(e => e?.node).map(e => e!.node!) ?? [],
)

export const selectAnalysis = createSelector(
  [
    selectAllAnalysis,
    selectAnalysisID,
  ],
  (allAnalysis, analysisID) => allAnalysis.find(a => a.id === analysisID),
)
