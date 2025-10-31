import type { GqlQuery } from './_types';
import type { ListAnnotationTaskQuery } from '../../../src/api/annotation-task/annotation-task.generated';
import { spectrogram, TASKS } from './types';


export const TASK_QUERIES: {
  listAnnotationTask: GqlQuery<ListAnnotationTaskQuery>,
  // getAnnotationTask: GqlQuery<GetAnnotationTaskQuery>, // TODO!!
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
  // getAnnotationTask: {
  //   defaultType: 'filled', // TODO: change!!
  //   empty: {
  //   },
  // },
}

