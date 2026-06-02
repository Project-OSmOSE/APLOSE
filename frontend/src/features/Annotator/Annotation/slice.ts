import { createSlice } from '@reduxjs/toolkit';
import {
  AnnotationAcousticFeaturesSerializerInput,
  AnnotationCommentSerializerInput,
  AnnotationInput,
  AnnotationType,
  AnnotationValidationSerializerInput,
} from '@/api';


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
}

const initialState: AnnotationState = {
  allAnnotations: [],
  id: undefined,
  tempAnnotation: undefined,
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

    initCampaign: (state) => {
      state.id = initialState.id
    },
    initSpectrogram: (state, action: {payload: {all: Annotation[], default?: Annotation}}) => {
      state.allAnnotations = action.payload.all
      state.id = action.payload.default?.id
    },
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
