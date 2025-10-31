import { Page } from '@playwright/test';
import { API_URL } from '../const';
import {
  ANNOTATOR_GROUP,
  CAMPAIGN,
  CAMPAIGN_PHASE,
  CHECK_DATA,
  CONFIDENCE,
  CREATE_DATA,
  DETECTOR,
  FILE_RANGE,
  LABEL,
  SPECTROGRAM_CONFIGURATION,
  USERS,
} from '../../fixtures';
import { Paginated } from '../../../src/service/type';
import { AnnotationFile, Phase } from '../../../src/service/types';

export class Mock {

  constructor(private page: Page) {
  }

  public async users(empty: boolean = false) {
    const json = empty ? [] : [ USERS.annotator, USERS.creator, USERS.staff, USERS.superuser ]
    await this.page.route(API_URL.user.list, route => route.fulfill({ status: 200, json }))
  }

  public async campaigns(empty: boolean = false) {
    await this.page.route(API_URL.campaign.list, route => route.fulfill({
      status: 200,
      json: empty ? [] : [ CAMPAIGN ],
    }))
    await this.page.route(API_URL.phase.list, route => route.fulfill({
      status: 200,
      json: empty ? [] : [ CAMPAIGN_PHASE, { ...CAMPAIGN_PHASE, id: 2, phase: 'Verification' } ],
    }))
  }

  public async campaignDetail(empty: boolean = false,
                              phase: Phase = 'Annotation',
                              hasConfidence: boolean = true,
                              allowPoint: boolean = false) {
    const json = CAMPAIGN;
    if (!hasConfidence) {
      json.confidence_set = null;
    }
    if (allowPoint) json.allow_point_annotation = true;
    await this.page.route(API_URL.campaign.detail, route => route.fulfill({ status: 200, json }))
    await this.page.route(API_URL.phase.detail, route => route.fulfill({
      status: 200, json: empty ? {
        ...CAMPAIGN_PHASE,
        progress: 0,
        total: 0,
        my_progress: 0,
        my_total: 0,
        phase,
      } : { ...CAMPAIGN_PHASE, phase },
    }))
  }

  public async spectrograms(empty: boolean = false) {
    const json = empty ? [] : [ SPECTROGRAM_CONFIGURATION ]
    await this.page.route(API_URL.spectrogram.list, route => route.fulfill({ status: 200, json }))
  }

  public async labelSetDetail() {
    await this.page.route(API_URL.label.detail, route => route.fulfill({ status: 200, json: LABEL.set }))
  }

  public async confidenceSetDetail() {
    await this.page.route(API_URL.confidence.detail, route => route.fulfill({ status: 200, json: CONFIDENCE.set }))
  }

  public async fileRanges(empty: boolean = false) {
    const json = empty ? [] : [ FILE_RANGE.range ]
    await this.page.route(API_URL.fileRanges.list, route => route.fulfill({ status: 200, json }))
  }

  public async annotatorGroups(empty: boolean = false) {
    const json = empty ? [] : [ ANNOTATOR_GROUP ]
    await this.page.route(API_URL.annotatorGroup.list, route => route.fulfill({ status: 200, json }))
  }

  public async fileRangesFiles(empty: boolean = false) {
    const results = empty ? [] : [ FILE_RANGE.submittedFile, FILE_RANGE.unsubmittedFile ]
    const json: Partial<Paginated<AnnotationFile>> & { resume?: number } = {
      results,
      count: results.length,
      resume: results.find(r => r.is_submitted === false)?.id,
    }
    await this.page.route(API_URL.fileRanges.file, route => route.fulfill({ status: 200, json }))
  }

  public async annotator(phase: Phase = 'Annotation', empty: boolean = false) {
    const json = phase === 'Annotation' ? CREATE_DATA(empty) : CHECK_DATA(empty)
    await this.page.route(API_URL.annotator, (route, request) => {
      if (request.method() === 'GET') route.fulfill({ status: 200, json })
      else route.fulfill({ status: 200 })
    });
  }

  async resultImport() {
    await this.page.route(API_URL.result.import, route => route.fulfill({
      status: 200,
      json: [],
    }))
  }

  async detectors(empty: boolean = false) {
    const json = empty ? [] : [ DETECTOR ]
    await this.page.route(API_URL.detector.list, route => route.fulfill({ status: 200, json }))
  }
}
