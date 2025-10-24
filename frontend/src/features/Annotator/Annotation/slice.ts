import { createSlice } from '@reduxjs/toolkit';
import {
  AnnotationType,
  getAnnotationTaskFulfilled,
  GetAnnotationTaskQuery,
  getCampaignFulfilled,
  type GetCampaignQuery,
  type PostAcousticFeatures,
  PostAnnotation,
  type PostAnnotationComment,
  type PostAnnotationValidation,
} from '@/api';
import { type Analysis, getDefaultAnalysisID, setAnalysis } from '@/features/Annotator/Analysis/slice';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import { convertGqlToAnnotations } from '@/features/Annotator/Annotation/post.hooks';


export type Comment = Omit<PostAnnotationComment, 'id'> & { id: number }
export type Validation = Omit<PostAnnotationValidation, 'id'> & { id: number }
export type Features = Omit<PostAcousticFeatures, 'id'> & { id: number }
export type Annotation =
    Omit<PostAnnotation, 'id' | 'comments' | 'validation' | 'acoustic_features' | 'is_update_of'>
    & {
  id: number,
  type: AnnotationType;
  comments?: Comment[];
  annotator?: string | number;
  validation?: Validation;
  update?: Annotation;
  acoustic_features?: Features;
};
export type TempAnnotation = Pick<Annotation, 'type' | 'start_time' | 'start_frequency' | 'end_time' | 'end_frequency'>

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
      if (!state._analysisID) return;
      const annotation: Annotation = {
        ...action.payload,
        analysis: state._analysisID,
      }
      state.allAnnotations = [...state.allAnnotations, annotation];
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
      const defaultAnnotation = [...state.allAnnotations].reverse().pop();
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
} = AnnotatorAnnotationSlice.actions
