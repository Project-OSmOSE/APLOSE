import { createSlice } from '@reduxjs/toolkit';
import { type Annotation, blur, focusAnnotation } from '@/features/Annotator/Annotation/slice';

type LabelState = {
    hiddenLabels: string[];
    focus?: string;

    _campaignID?: string;
}

const initialState: LabelState = {
    hiddenLabels: [],
    focus: undefined,

    _campaignID: undefined,
}

export const AnnotatorLabelSlice = createSlice({
    name: 'AnnotatorLabel',
    initialState,
    reducers: {
        setHiddenLabels: (state, action: { payload: string[] }) => {
            state.hiddenLabels = action.payload;
        },
        initCampaign: (state) => {
            state.focus = initialState.focus
            state.hiddenLabels = initialState.hiddenLabels
        },
        initSpectrogram: (state, action: { payload: { focus: string | undefined } }) => {
            state.focus = action.payload.focus
            state.hiddenLabels = initialState.hiddenLabels
        },
    },
    extraReducers: builder => {
        builder.addCase(focusAnnotation, (state: LabelState, action: { payload: Annotation }) => {
            state.focus = action.payload.label
        })
        builder.addCase(blur, (state: LabelState) => {
            state.focus = undefined
        })
    },
    selectors: {
        selectHiddenLabels: state => state.hiddenLabels,
        selectFocus: state => state.focus,
    },
})

export const {
    setHiddenLabels,
} = AnnotatorLabelSlice.actions
