import { createSlice } from '@reduxjs/toolkit';
import {
  AnnotationAcousticFeaturesSerializerInput,
  AnnotationCommentSerializerInput,
  AnnotationInput,
  AnnotationType,
  AnnotationValidationSerializerInput,
  getAnnotationTaskFulfilled,
  GetAnnotationTaskQuery,
  getCampaignFulfilled,
  type GetCampaignQuery,
} from '@/api';
import { type Analysis, getDefaultAnalysisID, setAnalysis } from '@/features/Annotator/Analysis/slice';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import { convertGqlToAnnotations } from '@/features/Annotator/Annotation/conversions';


export type Comment = Omit<AnnotationCommentSerializerInput, 'id'> & { id: number }
export type Validation = Omit<AnnotationValidationSerializerInput, 'id'> & { id: number }
export type Features = Omit<AnnotationAcousticFeaturesSerializerInput, 'id'> & { id: number }
export type Annotation =
  Omit<AnnotationInput, 'id' | 'isUpdateOf' | 'comments' | 'validations' | 'acousticFeatures'>
  & {
  id: number,
  type: AnnotationType;
  comments?: Comment[];
  annotator?: string | number;
  validation?: Validation;
  update?: Annotation;
  acousticFeatures?: Features;
};
export type TempAnnotation = Pick<Annotation, 'type' | 'startTime' | 'startFrequency' | 'endTime' | 'endFrequency'>

type AnnotationState = {
  allAnnotations: Annotation[];
  id?: number;
  tempAnnotation?: TempAnnotation;

  _analysisID?: string;
  _campaignID?: string
}

const initialState: AnnotationState = {
  allAnnotations: [],
  id: undefined,
  tempAnnotation: undefined,

  _analysisID: undefined,
  _campaignID: undefined,
}

export const AnnotatorAnnotationSlice = createSlice({
  name: 'AnnotatorAnnotation',
  initialState,
  reducers: {
    focusAnnotation: (state, action: { payload: Annotation }) => {
      state.id = action.payload.id;
    },
    blur: (state) => {
      state.id = undefined
    },
    addAnnotation: (state, action: { payload: Omit<Annotation, 'analysis'> }) => {
      if (!state._analysisID || state.allAnnotations.some(a => a.id === action.payload.id)) return;
      const annotation: Annotation = {
        ...action.payload,
        analysis: state._analysisID,
      }
      state.allAnnotations = [ ...state.allAnnotations, annotation ];
      action.payload = annotation;
    },
    updateAnnotation: (state, action: { payload: Partial<Annotation> & Pick<Annotation, 'id'> }) => {
      const annotation: Annotation | undefined = state.allAnnotations.find(a => a.id === action.payload.id);
      if (!annotation) return;
      action.payload = {
        ...annotation,
        ...action.payload,
      }
      if (state._analysisID) {
        action.payload = { ...action.payload, analysis: state._analysisID }
      }
      state.allAnnotations = state.allAnnotations.map(a => a.id === action.payload.id ? action.payload as Annotation : a)
    },
    removeAnnotation: (state, action: { payload: Annotation }) => {
      state.allAnnotations = state.allAnnotations.filter(a => a.id !== action.payload.id)
    },
    setTempAnnotation: (state, action: { payload: TempAnnotation }) => {
      state.tempAnnotation = action.payload
    },
    clearTempAnnotation: (state) => {
      state.tempAnnotation = undefined
    },
  },
  extraReducers: builder => {
    builder.addCase(setAnalysis, (state: AnnotationState, action: { payload: Analysis }) => {
      state._analysisID = action.payload?.id;
    })
    builder.addMatcher(getCampaignFulfilled, (state: AnnotationState, action: {
      payload: GetCampaignQuery
    }) => {
      state._analysisID = getDefaultAnalysisID({ data: action.payload, id: state._analysisID })
    })
    builder.addMatcher(getAnnotationTaskFulfilled, (state: AnnotationState, action: {
      payload: GetAnnotationTaskQuery,
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
        state._campaignID = action.meta.arg.originalArgs.campaignID
        state.id = initialState.id
      }
      const annotations = action.payload.annotationSpectrogramById?.task?.annotations?.results.filter(a => a !== null).map(a => a!) ?? []
      state.allAnnotations = convertGqlToAnnotations(annotations)
      const defaultAnnotation = [ ...state.allAnnotations ].reverse().pop();
      state.id = defaultAnnotation?.id
    })
  },
  selectors: {
    selectAllAnnotations: state => state.allAnnotations,
    selectID: state => state.id,
    selectTempAnnotation: state => state.tempAnnotation,
  },
})

export const {
  selectAllAnnotations,
  selectID,
  selectTempAnnotation,
} = AnnotatorAnnotationSlice.selectors

export const {
  focusAnnotation,
  blur,
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  setTempAnnotation,
  clearTempAnnotation,
} = AnnotatorAnnotationSlice.actions
