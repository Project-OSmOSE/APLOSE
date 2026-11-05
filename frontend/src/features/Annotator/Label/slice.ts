import { createSlice } from '@reduxjs/toolkit';
import { type Annotation, blur, focusAnnotation } from '@/features/Annotator/Annotation/slice';

type LabelState = {
    hiddenLabelIds: string[];
    focusId?: string;

    _campaignID?: string;
}

const initialState: LabelState = {
    hiddenLabelIds: [],
    focusId: undefined,

    _campaignID: undefined,
}

export const AnnotatorLabelSlice = createSlice({
    name: 'AnnotatorLabel',
    initialState,
    reducers: {
        setHiddenLabelIds: (state, action: { payload: string[] }) => {
            state.hiddenLabelIds = action.payload;
        },
        initCampaign: (state) => {
            state.focusId = initialState.focusId
            state.hiddenLabelIds = initialState.hiddenLabelIds
        },
        initSpectrogram: (state, action: { payload: { focus: string | undefined } }) => {
            state.focusId = action.payload.focus
            state.hiddenLabelIds = initialState.hiddenLabelIds
        },
    },
    extraReducers: builder => {
        builder.addCase(focusAnnotation, (state: LabelState, action: { payload: Annotation }) => {
            state.focusId = action.payload.labelId
        })
        builder.addCase(blur, (state: LabelState) => {
            state.focusId = undefined
        })
    },
    selectors: {
        selectHiddenLabelIds: state => state.hiddenLabelIds,
        selectFocusId: state => state.focusId,
    },
})

export const {
    setHiddenLabelIds,
} = AnnotatorLabelSlice.actions
