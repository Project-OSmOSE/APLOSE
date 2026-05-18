import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorAnalysisSlice } from './slice'
import { selectAnnotatorCampaign } from '@/features/Annotator/selectors';
import type { AppState } from '@/features/App';


export const selectAnalysisID = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorAnalysisSlice.selectors.selectID,
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
