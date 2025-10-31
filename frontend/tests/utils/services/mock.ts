import { Page } from '@playwright/test';
import { API_URL } from '../const';
import { CHECK_DATA, CREATE_DATA } from '../../fixtures';
import { Phase } from '../../../src/service/types';

export class Mock {

  constructor(private page: Page) {
  }

  public async annotator(phase: Phase = 'Annotation', empty: boolean = false) {
    const json = phase === 'Annotation' ? CREATE_DATA(empty) : CHECK_DATA(empty)
    await this.page.route(API_URL.annotator, (route, request) => {
      if (request.method() === 'GET') route.fulfill({ status: 200, json })
      else route.fulfill({ status: 200 })
    });
  }
}
