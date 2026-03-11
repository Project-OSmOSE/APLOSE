import { type AppState } from '@/features/App';
import { selectAnnotator } from '@/features/Annotator/selectors';
import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorZoomSlice } from './slice'
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { selectSpectrogramMode } from '@/features/Annotator/VisualConfiguration';

export const selectZoom = createSelector(
    selectAnnotator, AnnotatorZoomSlice.selectors.selectZoom,
)

export const selectDisplayZoom = createSelector(
    selectAnnotator, AnnotatorZoomSlice.selectors.selectDisplayZoom,
)

export const selectZoomOrigin = createSelector(
    selectAnnotator, AnnotatorZoomSlice.selectors.selectZoomOrigin,
)

export const selectZoomMode = createSelector(
    selectAnnotator, AnnotatorZoomSlice.selectors.selectZoomMode,
)

export const selectZoomOutLevel = createSelector(
    selectZoom,
    (zoom) => zoom - 1 >= 0 ? zoom - 1 : undefined,
)

export const selectMaxZoom = createSelector(
    [
        // Input selectors
        selectAnalysis,
        selectSpectrogramMode,
        selectZoomMode,
        // Pass through input arguments
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_state: AppState, _campaignID?: string) => undefined,
    ],
    (analysis, mode, zoomMode) => {
        if (mode === 'png' && zoomMode === 'processed') return analysis?.legacyConfiguration?.zoomLevel ?? 0
        return 4
    },
)

export const selectZoomInLevel = createSelector(
    [
        // Input selectors
        selectMaxZoom,
        selectZoom,
        // Pass through input arguments
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_state: AppState, _campaignID?: string) => undefined,
    ],
    (maxZoom, zoom) => zoom + 1 <= maxZoom ? zoom + 1 : undefined,
)
