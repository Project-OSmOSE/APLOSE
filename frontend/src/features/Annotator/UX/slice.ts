import { createSlice } from '@reduxjs/toolkit';
import { addAnnotation, removeAnnotation, updateAnnotation } from '@/features/Annotator/Annotation/slice';
import { addTaskComment, removeTaskComment, updateTaskComment } from '@/features/Annotator/Comment/slice';

type UXState = {
    updated: boolean;
    allFileIsSeen: boolean;
    isDrawingEnabled: boolean;
    selectPositionForAnnotation: string | number | null; // ID
    start: number;
}

const initialState: UXState = {
    updated: false,
    allFileIsSeen: true, // Because initial zoom level == 1
    isDrawingEnabled: true,
    selectPositionForAnnotation: null,
    start: Date.now(),
}

export const AnnotatorUXSlice = createSlice({
    name: 'AnnotatorUX',
    initialState,
    reducers: {
        setAllFileAsSeen: (state) => {
            state.allFileIsSeen = true;
        },
        selectPosition: (state, action: { payload: { id: string | number } }) => {
            state.selectPositionForAnnotation = action.payload.id
        },
        endPositionSelection: (state) => {
            state.selectPositionForAnnotation = null
        },

        initSpectrogram: (state, action: { payload: { zoomLevel: number } }) => {
            state.updated = false
            state.allFileIsSeen = action.payload.zoomLevel === 1
            state.isDrawingEnabled = true
            state.selectPositionForAnnotation = null
            state.start = Date.now()
        },
    },
    extraReducers: builder => {
        builder.addCase(addAnnotation, (state: UXState) => {
            state.updated = true
        })
        builder.addCase(addTaskComment, (state: UXState) => {
            state.updated = true
        })
        builder.addCase(updateAnnotation, (state: UXState) => {
            state.updated = true
        })
        builder.addCase(updateTaskComment, (state: UXState) => {
            state.updated = true
        })
        builder.addCase(removeAnnotation, (state: UXState) => {
            state.updated = true
        })
        builder.addCase(removeTaskComment, (state: UXState) => {
            state.updated = true
        })
    },
    selectors: {
        selectIsDrawingEnabled: state => state.isDrawingEnabled && !state.selectPositionForAnnotation,
        selectIsSelectingPositionForAnnotation: state => state.selectPositionForAnnotation,
        selectAllFileIsSeen: state => state.allFileIsSeen,
        selectUpdated: state => state.updated,
        selectStart: state => state.start,
    },
})

export const {
    setAllFileAsSeen,

    // isSelectingAnnotationFrequency
    selectPosition,
    endPositionSelection,
} = AnnotatorUXSlice.actions
