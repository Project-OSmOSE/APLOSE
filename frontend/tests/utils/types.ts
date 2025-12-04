import type { UserType } from './mock/types';
import { AnnotationPhaseType, AnnotationType } from '../../src/api/types.gql-generated';

export type Method = 'mouse' | 'shortcut'

export type Params = {
  tag?: string,
  as: UserType,
  type: AnnotationType,
  phase: AnnotationPhaseType,
  method: Method
}
