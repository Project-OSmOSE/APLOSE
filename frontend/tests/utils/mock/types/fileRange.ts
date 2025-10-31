import type { AnnotationFileRangeNode } from '../../../../src/api/types.gql-generated';

const start = new Date()
const end = new Date()
end.setSeconds(end.getSeconds() + 10 * 2)
export type FileRange = Omit<AnnotationFileRangeNode,
  'annotator' | 'annotationPhase' | 'annotationTasks' | 'spectrograms'
>
export const fileRange: FileRange = {
  id: '1',
  firstFileIndex: 0,
  lastFileIndex: 1,
  filesCount: 2,
  fromDatetime: start,
  toDatetime: end,
}

