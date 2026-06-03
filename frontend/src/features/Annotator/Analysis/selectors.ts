import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorAnalysisSlice } from './slice'
import type { AppState } from '@/features/App';


export const selectAnalysisID = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorAnalysisSlice.selectors.selectID,
)
