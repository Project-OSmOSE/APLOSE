import { useMemo } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { useAppSelector } from '@/features/App';
import { AnnotatorUXSlice } from './slice';
import { AnnotatorLabelSlice } from '@/features/Annotator/Label';

export const useIsDrawingEnabled = () => {
    const { isEditionAuthorized } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID/phase/$phaseType/spectrogram/$spectrogramID' })
    const isEnabled = useAppSelector(state => AnnotatorUXSlice.selectors.selectIsDrawingEnabled(state.annotator))
    return useMemo(() => isEnabled && isEditionAuthorized, [ isEnabled, isEditionAuthorized ])
}

export const useCanDraw = () => {
    const isEnabled = useIsDrawingEnabled()
    const focusLabel = useAppSelector(state => AnnotatorLabelSlice.selectors.selectFocus(state.annotator))
    return useMemo(() => isEnabled && !!focusLabel, [ isEnabled, focusLabel ])
}
