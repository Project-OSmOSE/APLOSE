import { createSelector, createSlice } from "@reduxjs/toolkit";
import { AnnotatorAPI } from './api';
import { AppState } from "@/service/app.ts";
import { Colormap } from "@/service/ui/color.ts";
import {
  AcousticFeaturesNode,
  AnnotationCommentNode,
  AnnotationLabelNode,
  AnnotationNode,
  AnnotationPhaseNode,
  AnnotationPhaseType,
  AnnotationValidationNode,
  ConfidenceNode,
  DetectorConfigurationNode,
  DetectorNode,
  UserNode,
} from "@/features/gql/types.generated.ts";
import { UserAPI } from "@/service/api/user.ts";

export type AnnotatorState = {
  annotations: Array<Pick<AnnotationNode, 'id' | 'type' | 'startTime' | 'startFrequency' | 'endTime' | 'endFrequency' | 'isUpdateOfId'> & {
    annotator?: Pick<UserNode, 'id' | 'displayName'> | null,
    detectorConfiguration?: Pick<DetectorConfigurationNode, 'id' | 'configuration'> & {
      detector: Pick<DetectorNode, 'name'>
    } | null,
    label: Pick<AnnotationLabelNode, 'name'>,
    confidence?: Pick<ConfidenceNode, 'label'> | null,
    validations?: {
      results: Array<Pick<AnnotationValidationNode, 'id' | 'isValid'> | null>
    } | null,
    acousticFeatures?: Omit<AcousticFeaturesNode, 'id' | 'annotation' | '__typename'>,
    annotationPhase: Pick<AnnotationPhaseNode, 'id'>,
  }>,
  comments: Array<Pick<AnnotationCommentNode, 'id' | 'comment' | 'annotationId'> & {
    author: Pick<UserNode, 'id' | 'displayName'> | null,
  }>,
  input: {
    colormap?: Colormap;
    invertColormap?: boolean;
    brightness: number;
    contrast: number;
    analysisID?: string;
    annotationID?: string;
    audioSpeed: number;
    zoom: number;
    labelName?: string;
    confidenceLabel?: string;
    zoomOrigin?: { x: number, y: number },
  },
  ui: {
    pointerPosition?: { time: number, frequency: number },
    hiddenLabels: string[],
    canSubmit: boolean,
    hasChanged: boolean,
    didSeeAllFile: boolean,
    isAnnotationDisabled: boolean,
  },
  audio: {
    time: number;
    isPaused: boolean;
    stopTime?: number;
  },
  __utils: {
    phase: AnnotationPhaseType,
    annotator?: Pick<UserNode, 'id' | 'displayName'> | null, // TODO: check this is really used
    sessionStart?: number;
    campaignID?: string,
  }
}

const initialState: AnnotatorState = {
  annotations: [],
  comments: [],
  input: {
    audioSpeed: 1,
    zoom: 1,
    brightness: 50,
    contrast: 50,
  },
  ui: {
    hiddenLabels: [],
    canSubmit: false,
    hasChanged: false,
    didSeeAllFile: false,
    isAnnotationDisabled: false,
  },
  audio: {
    time: 0,
    isPaused: true
  },
  __utils: {
    phase: AnnotationPhaseType.Annotation, // TODO: check this is really used
    sessionStart: Date.now()
  }
}

export type Annotation = AnnotatorState['annotations'][number];
export type AddAnnotation =
  Partial<Omit<Annotation, 'id' | 'annotator' | 'detectorConfiguration'>>
  & Pick<Annotation, 'id' | 'type' | 'label' | 'annotationPhase'>
export type UpdateAnnotation = Partial<Omit<Annotation, 'id' | 'annotator' | 'type' | 'detectorConfiguration'>>

export type Comment = AnnotatorState['comments'][number];
export type UpdateComment = Pick<Comment, 'comment'>;
export type AddComment = Pick<Comment, 'id' | 'comment'>;

export const AnnotatorSlice = createSlice({
  name: 'AnnotatorSlice',
  initialState,
  reducers: {
    // Annotations
    assignAnnotation: (state, action: {
      payload: {
        id: string;
        partialUpdate: UpdateAnnotation
      }
    }) => {
      state.annotations = state.annotations.map(a => a.id === action.payload.id ? { ...a, ...action.payload.partialUpdate } : a);
      state.ui.hasChanged = true
    },
    addAnnotation: (state, action: { payload: AddAnnotation }) => {
      state.annotations = [ ...state.annotations, {
        ...action.payload,
        id: (Math.min(0, ...state.annotations.map(a => +a.id)) - 1).toString(),
        annotator: state.__utils.annotator
      } ]
      state.ui.hasChanged = true
    },
    removeAnnotation: (state, action: { payload: Pick<Annotation, 'id'> }) => {
      state.annotations = state.annotations.filter(a => a.id !== action.payload.id)
      state.ui.hasChanged = true
    },
    // Comments
    assignComment: (state, action: {
      payload: {
        id: string;
        partialUpdate: UpdateComment
      }
    }) => {
      state.comments = state.comments.map(a => a.id === action.payload.id ? { ...a, ...action.payload.partialUpdate } : a);
      state.ui.hasChanged = true
    },
    addComment: (state, action: { payload: AddComment }) => {
      state.comments = [ ...state.comments, {
        ...action.payload,
        author: state.__utils.annotator!
      } ]
      state.ui.hasChanged = true
    },
    removeComment: (state, action: { payload: Pick<Comment, 'id'> }) => {
      state.comments = state.comments.filter(a => a.id !== action.payload.id)
      state.ui.hasChanged = true
    },
    // Input
    setInput: (state, action: { payload: Partial<AnnotatorState['input']> }) => {
      Object.assign(state.input, action.payload);
    },
    // UI
    setUI: (state, action: { payload: Partial<AnnotatorState['ui']> }) => {
      Object.assign(state.ui, action.payload);
    },
    // Audio
    onPlay: (state) => {
      state.audio.isPaused = false;
    },
    onPause: (state) => {
      state.audio.isPaused = true;
    },
    setTime: (state, action: { payload: number }) => {
      state.audio.time = action.payload ?? 0;
    },
    setStopTime: (state, action: { payload: number | undefined }) => {
      state.audio.stopTime = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addMatcher(AnnotatorAPI.endpoints.getAnnotator.matchFulfilled, (state: AnnotatorState, {
      payload,
      meta: { arg }
    }) => {
      // Annotations
      const annotations = [];
      annotations.push(
        ...(payload.userAnnotations?.results ?? []).filter(a => a !== null).map(a => ({
          ...a,
          annotatorId: arg.originalArgs.annotatorID
        })),
      )
      if (arg.originalArgs.phaseType === AnnotationPhaseType.Verification) {
        annotations.push(
          ...(payload.otherAnnotations?.results ?? []).filter(a => a !== null),
        )
      }

      const defaultAnnotation = [ ...annotations ].reverse().pop();
      const confidences = payload.annotationCampaignConfidenceSet?.confidenceIndicators?.results ?? []
      Object.assign(state, {
        ...initialState,
        annotations,
        comments: (payload.allAnnotationComments?.results ?? []).filter(c => c !== null),
        input: state.__utils.campaignID === arg.originalArgs.campaignID ? {
          ...state.input,
          annotationID: defaultAnnotation?.id,
          labelName: defaultAnnotation?.label.name,
          confidenceLabel: defaultAnnotation?.confidence?.label ??
            (confidences.find(c => c?.isDefault) ?? confidences.find(c => c !== null))?.label,
          analysisID: payload.allSpectrogramAnalysis?.results.filter(r => r !== null).reverse().pop()?.id,
          brightness: 50,
          contrast: 50,
        } : initialState.input,
        __utils: {
          phase: arg.originalArgs.phaseType,
          annotator: state.__utils.annotator,
          sessionStart: Date.now(),
          campaignID: arg.originalArgs.campaignID,
        }
      })

      // UI
      if (state.input.zoom === 1) state.ui.didSeeAllFile = true;

    })

    builder.addMatcher(UserAPI.endpoints.getCurrentUser.matchFulfilled, (state: AnnotatorState, { payload }) => {
      state.__utils.annotator = {
        id: payload.id.toString(),
        displayName: payload.display_name
      }
    })
  }
})

export const selectAnnotations = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.annotations,
)
export const selectComments = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.comments,
)
export const selectAnnotationID = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.input.annotationID,
)
export const selectAudio = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.audio,
)
export const selectConfidenceChoice = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.input.confidenceLabel,
)
export const selectLabelChoice = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.input.labelName,
)

export const selectInput = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.input,
)
export const selectUI = createSelector(
  (state: AppState) => state.AnnotatorSlice,
  (state: AnnotatorState) => state.ui,
)
