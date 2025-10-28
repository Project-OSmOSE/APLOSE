import { createSlice } from '@reduxjs/toolkit';
import { AnnotationCommentInput, getAnnotationTaskFulfilled, type GetAnnotationTaskQuery } from '@/api';


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
      state.taskComments = [...state.taskComments, action.payload];
    },
    updateTaskComment: (state, action: { payload: Comment }) => {
      state.taskComments = state.taskComments.map(c => c.id === action.payload.id ? action.payload : c)
    },
    removeTaskComment: (state, action: { payload: Comment }) => {
      state.taskComments = state.taskComments.filter(c => c.id !== action.payload.id)
    },
  },
  extraReducers: builder => {
    builder.addMatcher(getAnnotationTaskFulfilled, (state: AnnotationCommentState, action: {
      payload: GetAnnotationTaskQuery
    }) => {
      state.taskComments = action.payload.annotationSpectrogramById?.task?.comments?.results.filter(r => !!r).map(r => ({
        id: +r!.id,
        comment: r!.comment,
      } as Comment)) ?? initialState.taskComments
    })
  },
  selectors: {
    selectTaskComments: state => state.taskComments,
  },
})

export const {
  selectTaskComments,
} = AnnotatorCommentSlice.selectors

export const {
  addTaskComment,
  updateTaskComment,
  removeTaskComment,
} = AnnotatorCommentSlice.actions
