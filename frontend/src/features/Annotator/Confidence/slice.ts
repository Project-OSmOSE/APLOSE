import { createSlice } from '@reduxjs/toolkit';
import { type Annotation, blur, focusAnnotation } from '@/features/Annotator/Annotation/slice';
import {
  ConfidenceNode,
  getAnnotationTaskFulfilled,
  type GetAnnotationTaskQuery,
  getCampaignFulfilled,
  type GetCampaignQuery,
  getCurrentUserFulfilled,
  type GetCurrentUserQuery,
} from '@/api';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import { convertGqlToAnnotations } from '@/features/Annotator/Annotation';

export type Confidence = Pick<ConfidenceNode, 'isDefault' | 'label'>

type ConfidenceState = {
  focus?: string;

  _defaultConfidence?: string;
  _campaignID?: string;
  _userID?: string;
}

const initialState: ConfidenceState = {
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
      state.focus = action.payload.confidence ?? undefined
    })
    builder.addCase(blur, (state: ConfidenceState) => {
      state.focus = state._defaultConfidence
    })
    builder.addMatcher(getCampaignFulfilled, (state: ConfidenceState, action: { payload: GetCampaignQuery }) => {
      const allConfidences = action.payload.annotationCampaignById?.confidenceSet?.confidenceIndicators?.filter(c => c !== null).map(c => c!) ?? []
      state._defaultConfidence = (allConfidences?.find(c => c?.isDefault) ?? allConfidences?.find(c => c !== null))?.label
      if (state._campaignID !== action.payload.annotationCampaignById?.id) {
        state._campaignID = action.payload.annotationCampaignById?.id
        state.focus = state._defaultConfidence ?? initialState.focus
      }
    })
    builder.addMatcher(getCurrentUserFulfilled, (state: ConfidenceState, action: {
      payload: GetCurrentUserQuery
    }) => {
      state._userID = action.payload.currentUser?.id
    })
    builder.addMatcher(getAnnotationTaskFulfilled, (state: ConfidenceState, action: {
      payload: GetAnnotationTaskQuery
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      const annotations = action.payload.annotationSpectrogramById?.task?.annotations?.results.filter(a => a !== null).map(a => a!) ?? []
      const defaultAnnotation = [ ...convertGqlToAnnotations(annotations, action.meta.arg.originalArgs.phaseType, state._userID) ].reverse().pop();
      state.focus = defaultAnnotation?.update?.confidence ?? defaultAnnotation?.confidence ?? state._defaultConfidence ?? initialState.focus
    })
  },
  selectors: {
    selectFocus: state => state.focus,
  },
})

export const {
  focus: focusConfidence,
} = AnnotatorConfidenceSlice.actions
