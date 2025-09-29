import { Page } from '@playwright/test';
import { Serializable } from 'playwright-core/types/structs';
import { API_URL } from '../const';
import {
  ANNOTATOR_GROUP,
  AUDIO_METADATA,
  AUTH,
  CAMPAIGN,
  CAMPAIGN_PHASE,
  CHECK_DATA,
  CONFIDENCE,
  CREATE_DATA,
  DATASET,
  DETECTOR,
  FILE_RANGE,
  LABEL,
  SPECTROGRAM_CONFIGURATION,
  USERS,
  UserType
} from '../../fixtures';
import { Paginated } from '../../../src/service/type';
import { AnnotationCampaign, AnnotationFile, Phase } from '../../../src/service/types';
import {
  GetAvailableDatasetsForImportQuery,
  GetAvailableSpectrogramAnalysisForImportQuery
} from "../../../src/features/data/import/api/import-data.generated";
import {
  GetDatasetByPkQuery,
  GetDatasetsQuery,
  GetSpectrogramAnalysisQuery
} from "../../../src/features/data/display/api/display-data.generated";
import { GetDatasetsAndAnalysisQuery } from "../../../src/features/data/input/api/input.generated";
import { COLORMAP_GREYS } from "../../../src/service/ui/color";
import {
  GetChannelConfigurationsQuery
} from "../../../src/features/metadatax/acquisition/display/api/display-acquisition.generated";
import { ListCampaignsAndPhasesQuery } from "../../../src/features/annotation/api/annotation.generated";
import { AnnotationPhaseType } from "../../../src/features/_utils_/gql/types.generated";

type Response = {
  status: number,
  json?: Serializable
}

export class Mock {

  constructor(private page: Page) {
  }

  public static getError(field: string) {
    return `Custom error for ${ field }`;
  }

  public async collaborators() {
    await this.page.route(API_URL.collaborators, route => route.fulfill({ status: 200, json: [] }))
  }

  public async token(response: Response = { status: 200, json: { detail: AUTH.token } }) {
    await this.page.route(API_URL.token, route => route.fulfill(response))
  }

  public async users(empty: boolean = false) {
    const json = empty ? [] : [ USERS.annotator, USERS.creator, USERS.staff, USERS.superuser ]
    await this.page.route(API_URL.user.list, route => route.fulfill({ status: 200, json }))
  }

  public async userSelf(type: UserType | null) {
    if (type === null)
      await this.page.route(API_URL.user.self, route => route.fulfill({ status: 401 }))
    else
      await this.page.route(API_URL.user.self, route => route.fulfill({ status: 200, json: USERS[type] }))
  }

  public async campaigns(empty: boolean = false) {
    await this.page.route(API_URL.campaign.list, route => route.fulfill({
      status: 200,
      json: empty ? [] : [ CAMPAIGN ]
    }))
    await this.page.route(API_URL.phase.list, route => route.fulfill({
      status: 200,
      json: empty ? [] : [ CAMPAIGN_PHASE, { ...CAMPAIGN_PHASE, id: 2, phase: 'Verification' } ]
    }))
  }

  public async campaignCreate(withErrors: boolean = false) {
    let json: Serializable = CAMPAIGN;
    let status = 200;
    if (withErrors) {
      status = 400;
      json = {
        name: [ Mock.getError('name') ],
        desc: [ Mock.getError('desc') ],
        instructions_url: [ Mock.getError('instructions_url') ],
        deadline: [ Mock.getError('deadline') ],
        dataset: [ Mock.getError('datasets') ],
        analysis: [ Mock.getError('spectro_configs') ],
        usage: [ Mock.getError('usage') ],
        label_set: [ Mock.getError('label_set') ],
        confidence_indicator_set: [ Mock.getError('confidence_indicator_set') ],
      }
    }
    await this.page.route(API_URL.campaign.create, (route, request) => {
      if (request.method() === 'POST') route.fulfill({ status, json })
      else route.continue()
    })
  }

  public async campaignDetail(empty: boolean = false,
                              phase: Phase = 'Annotation',
                              hasConfidence: boolean = true,
                              allowPoint: boolean = false) {
    const json: AnnotationCampaign = CAMPAIGN;
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
        phase
      } : { ...CAMPAIGN_PHASE, phase }
    }))
  }

  public async spectrograms(empty: boolean = false) {
    const json = empty ? [] : [ SPECTROGRAM_CONFIGURATION ]
    await this.page.route(API_URL.spectrogram.list, route => route.fulfill({ status: 200, json }))
  }

  public async audios(empty: boolean = false) {
    const json = empty ? [] : [ AUDIO_METADATA ]
    await this.page.route(API_URL.audio.list, route => route.fulfill({ status: 200, json }))
  }

  public async datasets(empty: boolean = false) {
    const json = empty ? [] : [ DATASET ]
    await this.page.route(API_URL.dataset.list, route => route.fulfill({ status: 200, json }))
  }

  public async labelSets(empty: boolean = false) {
    const json = empty ? [] : [ LABEL.set ]
    await this.page.route(API_URL.label.list, route => route.fulfill({ status: 200, json }))
  }

  public async labelSetDetail() {
    await this.page.route(API_URL.label.detail, route => route.fulfill({ status: 200, json: LABEL.set }))
  }

  public async confidenceSets(empty: boolean = false) {
    const json = empty ? [] : [ CONFIDENCE.set ]
    await this.page.route(API_URL.confidence.list, route => route.fulfill({ status: 200, json }))
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
      resume: results.find(r => r.is_submitted === false)?.id
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

  public async campaignArchive() {
    await this.page.route(API_URL.campaign.archive, route => route.fulfill({ status: 200 }));
  }


  async resultImport() {
    await this.page.route(API_URL.result.import, route => route.fulfill({
      status: 200,
      json: []
    }))
  }

  async detectors(empty: boolean = false) {
    const json = empty ? [] : [ DETECTOR ]
    await this.page.route(API_URL.detector.list, route => route.fulfill({ status: 200, json }))
  }
}

const deadline = new Date()
deadline.setTime(0)

export const MOCK_QUERIES: {
  [key in string]: { [key in MockType]: any }
} = {
  getAvailableDatasetsForImport: {
    empty: {
      allDatasetsAvailableForImport: []
    } satisfies GetAvailableDatasetsForImportQuery as GetAvailableDatasetsForImportQuery,
    filled: {
      allDatasetsAvailableForImport: [ {
        name: 'Test import dataset',
        path: 'Test import dataset',
        analysis: [
          {
            name: 'Test analysis 1',
            path: 'Test analysis 1',
          },
          {
            name: 'Test analysis 2',
            path: 'Test analysis 2',
          }
        ]
      } ]
    } satisfies GetAvailableDatasetsForImportQuery as GetAvailableDatasetsForImportQuery
  },
  getDatasets: {
    empty: {
      allDatasets: {
        results: []
      }
    } satisfies GetDatasetsQuery as GetDatasetsQuery,
    filled: {
      allDatasets: {
        results: [
          {
            pk: 1,
            name: 'Test dataset',
            legacy: true,
            createdAt: new Date().toISOString(),
            start: "2021-08-02T00:00:00Z",
            end: "2022-07-13T06:00:00Z",
            filesCount: 99,
            description: "Coastal audio recordings",
            analysisCount: 1,
          }
        ]
      }
    } satisfies GetDatasetsQuery as GetDatasetsQuery
  },
  getDatasetByPk: {
    empty: {
      datasetByPk: undefined
    } satisfies GetDatasetByPkQuery as GetDatasetByPkQuery,
    filled: {
      datasetByPk: {
        pk: 1,
        name: 'Test dataset',
        path: 'test/dataset',
        description: "Coastal audio recordings",
        start: "2021-08-02T00:00:00Z",
        end: "2022-07-13T06:00:00Z",
        createdAt: new Date().toISOString(),
        legacy: true,
        owner: {
          displayName: 'John Doe'
        }
      }
    } satisfies GetDatasetByPkQuery as GetDatasetByPkQuery
  },
  getDatasetsAndAnalysis: {
    empty: {
      allDatasets: { results: [] }
    } satisfies GetDatasetsAndAnalysisQuery as GetDatasetsAndAnalysisQuery,
    filled: {
      allDatasets: {
        results: [
          {
            pk: 1,
            name: 'Test dataset',
            spectrogramAnalysis: {
              results: [
                {
                  pk: 1,
                  name: 'Test analysis',
                  colormap: { name: COLORMAP_GREYS }
                }
              ]
            }
          }
        ]
      }
    } satisfies GetDatasetsAndAnalysisQuery as GetDatasetsAndAnalysisQuery
  },

  getAvailableSpectrogramAnalysisForImport: {
    empty: {
      allSpectrogramAnalysisForImport: []
    } satisfies GetAvailableSpectrogramAnalysisForImportQuery as GetAvailableSpectrogramAnalysisForImportQuery,
    filled: {
      allSpectrogramAnalysisForImport: [
        {
          name: 'Test analysis 1',
          path: 'Test analysis 1',
        },
        {
          name: 'Test analysis 2',
          path: 'Test analysis 2',
        }
      ]
    } satisfies GetAvailableSpectrogramAnalysisForImportQuery as GetAvailableSpectrogramAnalysisForImportQuery
  },
  getSpectrogramAnalysis: {
    empty: {
      allSpectrogramAnalysis: {
        results: []
      }
    } satisfies GetSpectrogramAnalysisQuery as GetSpectrogramAnalysisQuery,
    filled: {
      allSpectrogramAnalysis: {
        results: [
          {
            pk: 1,
            name: 'Test analysis',
            description: "Coastal audio recordings",
            createdAt: new Date().toISOString(),
            legacy: true,
            filesCount: 99,
            start: "2021-08-02T00:00:00Z",
            end: "2022-07-13T06:00:00Z",
            dataDuration: 10,
            fft: {
              samplingFrequency: 64_000,
              nfft: 2_048,
              windowSize: 1_024,
              overlap: 0.95
            }
          }
        ]
      }
    } satisfies GetSpectrogramAnalysisQuery as GetSpectrogramAnalysisQuery
  },

  getChannelConfigurations: {
    empty: {
      allChannelConfigurations: null
    } satisfies GetChannelConfigurationsQuery as GetChannelConfigurationsQuery,
    filled: {
      allChannelConfigurations: {
        results: [
          {
            deployment: {
              name: 'Test deployment',
              campaign: {
                name: 'Phase 1'
              },
              site: {
                name: 'Site A'
              },
              project: {
                name: 'Test Project',
              }
            }
          }
        ]
      }
    } satisfies GetChannelConfigurationsQuery as GetChannelConfigurationsQuery
  },

  listCampaignsAndPhases: {
    empty: {
      allAnnotationCampaigns: null,
      allAnnotationPhases: null,
    } satisfies ListCampaignsAndPhasesQuery as ListCampaignsAndPhasesQuery,
    filled: {
      allAnnotationCampaigns: {
        results: [
          {
            pk: 1,
            name: 'Test campaign',
            datasetName: 'Test dataset',
            isArchived: false,
            deadline: deadline.toISOString().split('T')[0],
          }
        ]
      },
      allAnnotationPhases: {
        results: [
          {
            pk: 1,
            annotationCampaignPk: 1,
            phase: AnnotationPhaseType.Annotation,
            completedTasksCount: 50,
            tasksCount: 100,
            userCompletedTasksCount: 5,
            userTasksCount: 10,
          }
        ]
      }
    } satisfies ListCampaignsAndPhasesQuery as ListCampaignsAndPhasesQuery
  }
}
export const MOCK_MUTATIONS: {
  [key in string]: { empty: Record<string, never> }
} = {
  postDatasetForImport: { empty: {} },
  postAnalysisForImport: { empty: {} },
}

export const MOCK = { ...MOCK_QUERIES, ...MOCK_MUTATIONS }

export type QueryName = keyof typeof MOCK_QUERIES | keyof typeof MOCK_MUTATIONS

export type MockType = 'filled' | 'empty'