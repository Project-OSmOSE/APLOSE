import type { UserType } from './mock/types';
import { AnnotationPhaseType } from '../../src/api';
import { Page, test } from '@playwright/test';

export type Method = 'mouse' | 'shortcut'

export type Params = {
  as: UserType,
  phase: AnnotationPhaseType,
  method: Method
}

export interface AplosePage {
  pageName: string;

  go(): Promise<void>;

  goStep(): Promise<void>;

}

export class AbstractAplosePage implements AplosePage {
  pageName: 'Not implemented';

  constructor(protected page: Page) {
  }

  go(): Promise<void> {
    throw new Error('Not implemented');
  }

  goStep(): Promise<void> {
    return test.step(`Navigate to ${ this.pageName }`, this.go.bind(this));
  }
}