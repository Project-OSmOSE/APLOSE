import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorUXSlice } from './slice';
import type { AppState } from '@/features/App';


export const selectIsSelectingPositionForAnnotation = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorUXSlice.selectors.selectIsSelectingPositionForAnnotation,
)

export const selectAllFileIsSeen = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorUXSlice.selectors.selectAllFileIsSeen,
)

export const selectUpdated = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorUXSlice.selectors.selectUpdated,
)

export const selectStart = createSelector(
    (state: AppState) => state.annotator,
    (state) => new Date(AnnotatorUXSlice.selectors.selectStart(state)),
)
