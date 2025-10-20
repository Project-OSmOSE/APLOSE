import { createSelector, createSlice } from '@reduxjs/toolkit';
import { type ListAnnotationTaskQueryVariables } from './annotation-task.generated'
import { AppState } from '@/features/App';
import { logoutFulfilled } from '@/api';

export type AllTasksFilters =
  Pick<ListAnnotationTaskQueryVariables, 'search' | 'status' | 'from' | 'to' | 'withAnnotations' | 'annotationLabel' | 'annotationConfidence' | 'annotationDetector' | 'annotationAnnotator' | 'withAcousticFeatures'>
  & {
  page: number
}

function reset(state: AllTasksFilters) {
  state.search = undefined;
  state.status = undefined;
  state.from = undefined;
  state.to = undefined;
}

export const AllAnnotationTaskFilterSlice = createSlice({
  name: 'AllAnnotationTaskFilterSlice',
  initialState: {} as AllTasksFilters,
  reducers: {
    updateTaskFilters: (state: AllTasksFilters, { payload }: {
      payload: AllTasksFilters
    }) => {
      Object.assign(state, payload)
    },
    reset,
  },
  extraReducers: builder => {
    builder.addMatcher(logoutFulfilled, reset)
  },
})

export const selectAllTaskFilters = createSelector(
  (state: AppState) => state.AllAnnotationTaskFilterSlice,
  (state: AllTasksFilters) => state,
)
