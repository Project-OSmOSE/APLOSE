import { type AnnotationNode, AnnotationType } from '../../../../src/api/types.gql-generated';


export type Annotation = Omit<AnnotationNode,
  'label'
  | 'acousticFeatures'
  | 'annotationPhase'
  | 'spectrogram'
  | 'comments'
  | 'annotationComments'
  | 'annotator'
  | 'confidence'
  | 'validations'
  | 'detectorConfiguration'
  | 'updatedTo'
  | 'analysis'
  | 'createdAt'
  | 'lastUpdatedAt'
>

export const weakAnnotation: Annotation = {
  id: '1',
  type: AnnotationType.Weak,
  startTime: null,
  endTime: null,
  minFrequency: null,
  maxFrequency: null,
}


export const boxAnnotation: Annotation = {
  id: '2',
  type: AnnotationType.Box,
  startTime: 5,
  endTime: 10,
  minFrequency: 12,
  maxFrequency: 40,
}
