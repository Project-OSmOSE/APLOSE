import { createSlice } from '@reduxjs/toolkit';
import { type Annotation, blur, focusAnnotation } from '@/features/Annotator/Annotation/slice';
import type {
  GetAnnotationTaskQuery,
  GetAnnotationTaskQueryVariables,
} from '@/api/annotation-task/annotation-task.generated';
import { getAnnotationTaskFulfilled, getCampaignFulfilled, type GetCampaignQuery } from '@/api';
import { convertGqlToAnnotations } from '@/features/Annotator/Annotation';

type LabelState = {
  allLabels: string[];
  hiddenLabels: string[];
  focus?: string;

  _campaignID?: string;
}

const initialState: LabelState = {
  allLabels: [],
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
  },
  extraReducers: builder => {
    builder.addCase(focusAnnotation, (state: LabelState, action: { payload: Annotation }) => {
      state.focus = action.payload.label
    })
    builder.addCase(blur, (state: LabelState) => {
      state.focus = undefined
    })
    builder.addMatcher(getCampaignFulfilled, (state: LabelState, action: { payload: GetCampaignQuery }) => {
      state.allLabels = action.payload.annotationCampaignById?.labelSet?.labels?.filter(l => l !== null).map(l => l!.name) ?? []
    })
    builder.addMatcher(getAnnotationTaskFulfilled, (state: LabelState, action: {
      payload: GetAnnotationTaskQuery
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
        state._campaignID = action.meta.arg.originalArgs.campaignID
        state.focus = initialState.focus
      } else {
        const annotations = action.payload.annotationTasksForUserBySpectrogramId?.annotations?.results.filter(a => a !== null).map(a => a!) ?? []
        const defaultAnnotation = [ ...convertGqlToAnnotations(annotations) ].reverse().pop();
        state.focus = defaultAnnotation?.update?.label ?? defaultAnnotation?.label
      }
      state.hiddenLabels = initialState.hiddenLabels
    })
  },
  selectors: {
    selectHiddenLabels: state => state.hiddenLabels,
    selectFocus: state => state.focus,
  },
})

export const {
  selectHiddenLabels,
  selectFocus,
} = AnnotatorLabelSlice.selectors

export const {
  setHiddenLabels,
} = AnnotatorLabelSlice.actions
