import { createSlice } from '@reduxjs/toolkit';
import { type Annotation, blur, focusAnnotation } from '@/features/Annotator/Annotation/slice';
import {
  ConfidenceNode,
  getAnnotationTaskFulfilled,
  type GetAnnotationTaskQuery,
  getCampaignFulfilled,
  type GetCampaignQuery,
} from '@/api';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import { convertGqlToAnnotations } from '@/features/Annotator/Annotation';

export type Confidence = Pick<ConfidenceNode, 'isDefault' | 'label'>

type ConfidenceState = {
  allConfidences: Confidence[];
  focus?: string;

  _defaultConfidence?: string;
  _campaignID?: string;
}

const initialState: ConfidenceState = {
  allConfidences: [],
  focus: undefined,

  _defaultConfidence: undefined,
  _campaignID: undefined,
}

export const AnnotatorConfidenceSlice = createSlice({
  name: 'AnnotatorConfidence',
  initialState,
  reducers: {
    focus: (state, action: { payload: string }) => {
      state.focus = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(focusAnnotation, (state: ConfidenceState, action: { payload: Annotation }) => {
      state.focus = action.payload.confidence
    })
    builder.addCase(blur, (state: ConfidenceState) => {
      state.focus = state._defaultConfidence
    })
    builder.addMatcher(getCampaignFulfilled, (state: ConfidenceState, action: { payload: GetCampaignQuery }) => {
      state.allConfidences = action.payload.annotationCampaignById?.confidenceSet?.confidenceIndicators?.filter(c => c !== null).map(c => c!) ?? []
      state._defaultConfidence = (state.allConfidences?.find(c => c?.isDefault) ?? state.allConfidences?.find(c => c !== null))?.label
    })
    builder.addMatcher(getAnnotationTaskFulfilled, (state: ConfidenceState, action: {
      payload: GetAnnotationTaskQuery
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
        state._campaignID = action.meta.arg.originalArgs.campaignID
        state.focus = initialState.focus
      } else {
        const annotations = action.payload.annotationTasksForUserBySpectrogramId?.annotations?.results.filter(a => a !== null).map(a => a!) ?? []
        const defaultAnnotation = [ ...convertGqlToAnnotations(annotations) ].reverse().pop();
        state.focus = defaultAnnotation?.update?.confidence ?? defaultAnnotation?.confidence ?? state._defaultConfidence
      }
    })
  },
  selectors: {
    selectAllConfidences: state => state.allConfidences,
    selectFocus: state => state.focus,
  },
})

export const {
  selectAllConfidences,
  selectFocus,
} = AnnotatorConfidenceSlice.selectors

export const {
  focus,
} = AnnotatorConfidenceSlice.actions
