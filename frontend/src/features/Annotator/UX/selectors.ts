import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorUXSlice } from './slice';
import { selectFocusLabel } from '@/features/Annotator/Label';
import { selectTaskIsEditionAuthorized } from '@/features/Annotator/selectors';
import type { AppState } from '@/features/App';


const _selectIsDrawingEnabled = createSelector(
    (state: AppState) => state.annotator,
    AnnotatorUXSlice.selectors.selectIsDrawingEnabled,
)

export const selectIsDrawingEnabled = createSelector(
    [
        // Input selectors
        selectTaskIsEditionAuthorized,
        _selectIsDrawingEnabled,
    ],
    (isEditionAuthorized, isDrawingEnabled) => isEditionAuthorized && isDrawingEnabled,
)

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

export const selectCanDraw = createSelector(
    [
        // Input selectors
        selectIsDrawingEnabled,
        selectFocusLabel,
    ],
    (isDrawingEnabled, focusedLabel) => isDrawingEnabled && !!focusedLabel,
)
