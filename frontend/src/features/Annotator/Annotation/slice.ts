import { createSlice } from '@reduxjs/toolkit';
import {
  AnnotationAcousticFeaturesSerializerInput,
  AnnotationCommentSerializerInput,
  AnnotationInput,
  AnnotationType,
  AnnotationValidationSerializerInput,
  getAnnotationTaskFulfilled,
  GetAnnotationTaskQuery,
} from '@/api';
import type { GetAnnotationTaskQueryVariables } from '@/api/annotation-task/annotation-task.generated';
import { convertGqlToAnnotations } from '@/features/Annotator/Annotation/conversions';
import { User } from '@/features';


export type Comment = Omit<AnnotationCommentSerializerInput, 'id'> & { id: number }
export type Validation = AnnotationValidationSerializerInput
export type Features = AnnotationAcousticFeaturesSerializerInput
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

  _campaignID?: string
}

const initialState: AnnotationState = {
  allAnnotations: [],
  id: undefined,
  tempAnnotation: undefined,

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
      if (state.allAnnotations.some(a => a.id === action.payload.id)) return;
      state.allAnnotations = [ ...state.allAnnotations, action.payload ];
    },
    updateAnnotation: (state, action: { payload: Partial<Annotation> & Pick<Annotation, 'id'> }) => {
      const annotation: Annotation | undefined = state.allAnnotations.find(a => a.id === action.payload.id);
      if (!annotation) return;
      action.payload = {
        ...annotation,
        ...action.payload,
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
    builder.addMatcher(getAnnotationTaskFulfilled, (state: AnnotationState, action: {
      payload: GetAnnotationTaskQuery,
      meta: { arg: { originalArgs: GetAnnotationTaskQueryVariables } }
    }) => {
      if (state._campaignID !== action.meta.arg.originalArgs.campaignID) {
        state._campaignID = action.meta.arg.originalArgs.campaignID
        state.id = initialState.id
      }
      const annotations = [
          ...action.payload.annotationSpectrogramById?.task?.userAnnotations?.results ?? [],
        ...action.payload.annotationSpectrogramById?.task?.annotationsToCheck?.results ?? [],
      ].filter(a => a !== null).map(a => a!) ?? []
      const user = User.API.currentQueryCache()?.state.data
      state.allAnnotations = convertGqlToAnnotations(annotations, action.meta.arg.originalArgs.phaseType, user?.id)
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
  focusAnnotation,
  blur,
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  setTempAnnotation,
  clearTempAnnotation,
} = AnnotatorAnnotationSlice.actions
