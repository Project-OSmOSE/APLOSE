import { type AnnotationTaskNode, AnnotationTaskStatus } from '../../../src/api/types.gql-generated';
import type { GqlQuery } from './_types';
import type { ListAnnotationTaskQuery } from '../../../src/api/annotation-task/annotation-task.generated';
import { spectrogram } from './spectrogram';

export type Task =
  Omit<AnnotationTaskNode, 'annotations' | 'annotator' | 'validatedAnnotations' | 'annotationPhase' | 'spectrogram' | 'comments'>

export const TASKS: { [key in 'submitted' | 'unsubmitted']: Task } = {
  unsubmitted: {
    id: '1',
    status: AnnotationTaskStatus.Created,
    isAssigned: true,
  },
  submitted: {
    id: '2',
    status: AnnotationTaskStatus.Finished,
    isAssigned: true,
  },
}

export const TASK_QUERIES: {
  listAnnotationTask: GqlQuery<ListAnnotationTaskQuery>,
  // getAnnotationTask: GqlQuery<GetAnnotationTaskQuery>, // TODO!!
} = {
  listAnnotationTask: {
    defaultType: 'filled',
    empty: {
      annotationTasksForUser: null,
    },
    filled: {
      annotationTasksForUser: {
        results: [
          {
            status: AnnotationTaskStatus.Created,
            annotations: {
              totalCount: 0,
            },
            validatedAnnotations: {
              totalCount: 0,
            },
            spectrogram: {
              id: spectrogram.id,
              start: spectrogram.start,
              filename: spectrogram.filename,
              duration: spectrogram.duration,
            },
          },
          {
            status: AnnotationTaskStatus.Finished,
            annotations: {
              totalCount: 2,
            },
            validatedAnnotations: {
              totalCount: 0,
            },
            spectrogram: {
              id: spectrogram.id,
              start: spectrogram.start,
              filename: spectrogram.filename,
              duration: spectrogram.duration,
            },
          },
        ],
      },
    },
  },
  // getAnnotationTask: {
  //   defaultType: 'filled', // TODO: change!!
  //   empty: {
  //     annotationTasksForUser: null,
  //     annotationTasksForUserBySpectrogramId: null,
  //   },
  // },
}

