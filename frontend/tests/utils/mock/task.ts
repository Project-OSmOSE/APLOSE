import type { GqlQuery } from './_types';
import type {
  GetAnnotationTaskQuery,
  ListAnnotationTaskQuery,
  SubmitTaskMutation,
} from '../../../src/api/annotation-task/annotation-task.generated';
import {
  AUDIO_PATH,
  boxAnnotation,
  CONFIDENCES,
  dataset,
  LABELS,
  spectrogram,
  SPECTROGRAM_PATH,
  spectrogramAnalysis,
  taskComment,
  TASKS,
  USERS,
  weakAnnotation,
  weakAnnotationComment,
} from './types';


export const TASK_QUERIES: {
  listAnnotationTask: GqlQuery<ListAnnotationTaskQuery>,
  getAnnotationTask: GqlQuery<GetAnnotationTaskQuery, 'submitted' | 'unsubmitted'>,
} = {
  listAnnotationTask: {
    defaultType: 'filled',
    empty: {
      allAnnotationSpectrograms: null,
    },
    filled: {
      allAnnotationSpectrograms: {
        results: Object.values(TASKS).map(t => ({
          id: t.id,
          start: spectrogram.start,
          filename: spectrogram.filename,
          duration: spectrogram.duration,
          task: {
            status: t.status,
            annotations: {
              totalCount: t.annotationCount,
            },
            validatedAnnotations: {
              totalCount: t.validationAnnotationCount,
            },
          },
        })),
        totalCount: 2,
        resumeSpectrogramId: spectrogram.id,
      },
    },
  },
  getAnnotationTask: {
    defaultType: 'unsubmitted',
    empty: {
      allAnnotationSpectrograms: null,
      annotationSpectrogramById: null,
    },
    submitted: {
      allAnnotationSpectrograms: {
        totalCount: dataset.spectrogramCount,
        nextSpectrogramId: (+TASKS.submitted.id + 1)?.toString(),
        previousSpectrogramId: (+TASKS.submitted.id - 1)?.toString(),
        currentIndex: 2,
      },
      annotationSpectrogramById: {
        id: TASKS.submitted.id,
        start: spectrogram.start,
        filename: spectrogram.filename,
        duration: spectrogram.duration,
        path: SPECTROGRAM_PATH,
        audioPath: AUDIO_PATH,
        isAssigned: true,
        task: {
          status: TASKS.submitted.status,
          annotations: {
            results: [
              {
                ...weakAnnotation,
                annotator: {
                  id: USERS.annotator.id,
                  displayName: USERS.annotator.displayName,
                },
                label: {
                  name: LABELS.classic.name,
                },
                confidence: {
                  label: CONFIDENCES.sure.label,
                },
                analysis: {
                  id: spectrogramAnalysis.id,
                },
                comments: {
                  results: [ weakAnnotationComment ],
                },
              },
              {
                ...boxAnnotation,
                annotator: {
                  id: USERS.annotator.id,
                  displayName: USERS.annotator.displayName,
                },
                label: {
                  name: LABELS.classic.name,
                },
                confidence: {
                  label: CONFIDENCES.notSure.label,
                },
                analysis: {
                  id: spectrogramAnalysis.id,
                },
                comments: null,
              },
            ],
          },
          comments: {
            results: [ taskComment ],
          },
        },
      },
    },
    unsubmitted: {
      allAnnotationSpectrograms: {
        totalCount: dataset.spectrogramCount,
        nextSpectrogramId: (+TASKS.unsubmitted.id + 1)?.toString(),
        previousSpectrogramId: null,
        currentIndex: 1,
      },
      annotationSpectrogramById: {
        id: TASKS.unsubmitted.id,
        start: spectrogram.start,
        filename: spectrogram.filename,
        duration: spectrogram.duration,
        path: SPECTROGRAM_PATH,
        audioPath: AUDIO_PATH,
        isAssigned: true,
        task: {
          status: TASKS.unsubmitted.status,
          annotations: null,
          comments: null,
        },
      },
    },
  },
}

export const TASK_MUTATIONS: {
  submitTask: GqlQuery<SubmitTaskMutation, never>
} = {
  submitTask: {
    defaultType: 'empty',
    empty: {},
  },
}
