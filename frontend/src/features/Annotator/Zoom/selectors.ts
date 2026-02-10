import { type AppState } from '@/features/App';
import { selectAnnotator } from '@/features/Annotator/selectors';
import { createSelector } from '@reduxjs/toolkit';
import { AnnotatorZoomSlice } from './slice'
import { selectAnalysis } from '@/features/Annotator/Analysis';
import { selectSpectrogramMode } from '@/features/Annotator/VisualConfiguration';

export const selectZoom = createSelector(
    selectAnnotator, AnnotatorZoomSlice.selectors.selectZoom,
)

export const selectZoomOrigin = createSelector(
    selectAnnotator, AnnotatorZoomSlice.selectors.selectZoomOrigin,
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
        // Pass through input arguments
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (_state: AppState, _campaignID?: string) => undefined,
    ],
    (analysis, mode) => analysis?.legacyConfiguration?.zoomLevel ?? (mode === 'png' ? 0 : 4),
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
