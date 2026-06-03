import { createSlice } from '@reduxjs/toolkit';
import { type Annotation, blur, focusAnnotation } from '@/features/Annotator/Annotation/slice';
import { ConfidenceNode } from '@/api';

export type Confidence = Pick<ConfidenceNode, 'isDefault' | 'label'>

type ConfidenceState = {
    focus?: string;

    _defaultConfidence?: string;
}

const initialState: ConfidenceState = {
    focus: undefined,

    _defaultConfidence: undefined,
}

export const AnnotatorConfidenceSlice = createSlice({
    name: 'AnnotatorConfidence',
    initialState,
    reducers: {
        focus: (state, action: { payload: string }) => {
            state.focus = action.payload;
        },
        initCampaign: (state, action: { payload: { default: string | undefined } }) => {
            state._defaultConfidence = action.payload.default
            state.focus = state._defaultConfidence ?? initialState.focus
        },
        initSpectrogram: (state, action: { payload: { focus: string | undefined } }) => {
            state.focus = action.payload.focus ?? state._defaultConfidence
        },
    },
    extraReducers: builder => {
        builder.addCase(focusAnnotation, (state: ConfidenceState, action: { payload: Annotation }) => {
            state.focus = action.payload.confidence ?? undefined
        })
        builder.addCase(blur, (state: ConfidenceState) => {
            state.focus = state._defaultConfidence
        })
    },
    selectors: {
        selectFocus: state => state.focus,
        selectDefault: state => state._defaultConfidence,
    },
})

export const {
    focus: focusConfidence,
} = AnnotatorConfidenceSlice.actions
