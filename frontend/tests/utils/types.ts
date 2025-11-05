import type { UserType } from './mock/types';
import { AnnotationPhaseType } from '../../src/api';

export type Method = 'mouse' | 'shortcut'

export type Params = {
  as: UserType,
  phase: AnnotationPhaseType,
  method: Method
}
