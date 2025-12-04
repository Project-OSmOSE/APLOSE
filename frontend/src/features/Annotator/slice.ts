import { createSlice } from '@reduxjs/toolkit';
import {
  getAnnotationTaskFulfilled,
  type GetAnnotationTaskQueryVariables,
  getCampaignFulfilled,
  type GetCampaignQuery,
} from '@/api';

type AnnotatorState = {
  campaignID?: string;
  taskVariables?: GetAnnotationTaskQueryVariables;
}


export const AnnotatorSlice = createSlice({
  name: 'Annotator',
  initialState: {},
  reducers: {},
  extraReducers: builder => {
    builder.addMatcher(getCampaignFulfilled, (state: AnnotatorState, action: { payload: GetCampaignQuery }) => {
      state.campaignID = action.payload.annotationCampaignById?.id
    })
    builder.addMatcher(getAnnotationTaskFulfilled, (state: AnnotatorState, action: {
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      state.taskVariables = action.meta.arg.originalArgs
    })
  },
  selectors: {
    selectCampaignID: (state: AnnotatorState) => state.campaignID,
    selectTaskVariables: (state: AnnotatorState) => state.taskVariables,
  },
})
