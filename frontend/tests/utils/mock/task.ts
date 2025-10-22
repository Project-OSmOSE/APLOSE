import { type AnnotationTaskNode, AnnotationTaskStatus } from '../../../src/api/types.gql-generated';
import type { GqlQuery } from './_types';
import type { ListAnnotationTaskQuery } from '../../../src/api/annotation-task/annotation-task.generated';
import { spectrogram } from './spectrogram';

export type Task =
  Omit<AnnotationTaskNode, 'annotations' | 'annotator' | 'validatedAnnotations' | 'annotationPhase' | 'spectrogram' | 'comments'>
  & {
  annotationCount: number,
  validationAnnotationCount: number,
}

export const TASKS: { [key in 'submitted' | 'unsubmitted']: Task } = {
  unsubmitted: {
    id: '1',
    status: AnnotationTaskStatus.Created,
    annotationCount: 0,
    validationAnnotationCount: 0,
  },
  submitted: {
    id: '2',
    status: AnnotationTaskStatus.Finished,
    annotationCount: 2,
    validationAnnotationCount: 0,
  },
}

export const TASK_QUERIES: {
  listAnnotationTask: GqlQuery<ListAnnotationTaskQuery>,
  // getAnnotationTask: GqlQuery<GetAnnotationTaskQuery>, // TODO!!
} = {
  listAnnotationTask: {
    defaultType: 'filled',
    empty: {
      listAnnotationSpectrogram: null,
    },
    filled: {
      listAnnotationSpectrogram: {
        results: Object.values(TASKS).map(t => ({
          id: t.id,
          status: t.status,
          start: spectrogram.start,
          filename: spectrogram.filename,
          duration: spectrogram.duration,
          annotations: {
            totalCount: t.annotationCount,
          },
          validatedAnnotations: {
            totalCount: t.validationAnnotationCount,
          },
        })),
        totalCount: 2,
        resumeSpectrogramId: spectrogram.id,
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

