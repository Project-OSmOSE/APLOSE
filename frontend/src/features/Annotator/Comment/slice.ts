import { createSlice } from '@reduxjs/toolkit';
import { AnnotationCommentInput } from '@/api';
import { CommentFragment } from '@/features/AnnotationSpectrogram';


export type Comment = Omit<AnnotationCommentInput, 'id'> & { id: number }
type AnnotationCommentState = {
    taskComments: Comment[];
}

const initialState: AnnotationCommentState = {
    taskComments: [],
}

export const AnnotatorCommentSlice = createSlice({
    name: 'AnnotatorComment',
    initialState,
    reducers: {
        addTaskComment: (state, action: { payload: Comment }) => {
            state.taskComments = [ ...state.taskComments, action.payload ];
        },
        updateTaskComment: (state, action: { payload: Comment }) => {
            state.taskComments = state.taskComments.map(c => c.id === action.payload.id ? action.payload : c)
        },
        removeTaskComment: (state, action: { payload: Comment }) => {
            state.taskComments = state.taskComments.filter(c => c.id !== action.payload.id)
        },

        initSpectrogram: (state, action: { payload: { taskComments: CommentFragment[] } }) => {
            state.taskComments = action.payload.taskComments.map(c => ({
                id: +c.id,
                comment: c.comment,
            } as Comment));
        },
    },
    selectors: {
        selectTaskComments: state => state.taskComments,
    },
})

export const {
    addTaskComment,
    updateTaskComment,
    removeTaskComment,
} = AnnotatorCommentSlice.actions
