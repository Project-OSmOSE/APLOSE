import type { UserType } from './mock/types';
import { AnnotationPhaseType } from '../../src/api/types.gql-generated';

export type Method = 'mouse' | 'shortcut'

export type Params = {
  tag?: string,
  as: UserType,
  phase: AnnotationPhaseType,
  method: Method
}
