import { type AnnotationTaskNode, AnnotationTaskStatus } from '../../../../src/api/types.gql-generated';

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
