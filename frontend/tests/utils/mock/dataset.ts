import type { GqlQuery } from './_types';
import {
  GetDatasetByIdQuery,
  ImportNewDatasetMutation,
  ListAvailableDatasetsForImportQuery,
  ListDatasetsAndAnalysisQuery,
  ListDatasetsQuery,
} from '../../../src/api/dataset';
import type { DatasetNode } from '../../../src/api/types.gql-generated';
import type { Colormap } from '../../../src/features/Colormap';
import { USERS } from './user';
import { spectrogramAnalysis } from "./spectrogramAnalysis";

export type Dataset =
    Omit<DatasetNode, 'owner' | 'annotationCampaigns' | 'spectrogramAnalysis' | 'relatedChannelConfigurations'>

const start = '2021-08-02T00:00:00Z';
const end = '2022-07-13T06:00:00Z';
export const dataset: Dataset = {
  id: '1',
  name: 'Test dataset',
  path: 'test/dataset',
  description: 'Coastal audio recordings',
  createdAt: new Date().toISOString(),
  legacy: true,
}
export const DATASET_FILES_COUNT = 99

export const DATASET_QUERIES: {
  listDatasets: GqlQuery<ListDatasetsQuery>,
  getDatasetByID: GqlQuery<GetDatasetByIdQuery>,
  listAvailableDatasetsForImport: GqlQuery<ListAvailableDatasetsForImportQuery>,
  listDatasetsAndAnalysis: GqlQuery<ListDatasetsAndAnalysisQuery>,
} = {
  listDatasets: {
    defaultType: 'filled',
    empty: {
      allDatasets: {
        results: [],
      },
    },
    filled: {
      allDatasets: {
        results: [
          {
            id: dataset.id,
            name: dataset.name,
            legacy: dataset.legacy,
            createdAt: dataset.createdAt,
            description: dataset.description,
            spectrogramAnalysis: {
              totalCount: 1
            },
            spectrograms: {
              start,
              end,
              totalCount: DATASET_FILES_COUNT,
            }
          },
        ],
      },
    },
  },
  getDatasetByID: {
    defaultType: 'filled',
    empty: { datasetById: undefined },
    filled: {
      datasetById: {
        id: dataset.id,
        name: dataset.name,
        legacy: dataset.legacy,
        createdAt: dataset.createdAt,
        description: dataset.description,
        path: dataset.path,
        owner: {
          displayName: USERS.creator.displayName,
        },
        spectrograms: {
          start, end
        }
      },
    },
  },
  listAvailableDatasetsForImport: {
    defaultType: 'filled',
    empty: {
      allDatasetsForImport: [],
    },
    filled: {
      allDatasetsForImport: [ {
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
          },
        ],
      } ],
    },
  },
  listDatasetsAndAnalysis: {
    defaultType: 'filled',
    empty: {
      allDatasets: { results: [] },
    },
    filled: {
      allDatasets: {
        results: [
          {
            id: dataset.id,
            name: dataset.name,
            spectrogramAnalysis: {
              results: [
                {
                  id: spectrogramAnalysis.id,
                  name: spectrogramAnalysis.name,
                  colormap: { name: 'Greys' as Colormap },
                },
              ],
            },
          },
        ],
      },
    },
  },
}

export const DATASET_MUTATIONS: {
  importDataset: GqlQuery<ImportNewDatasetMutation, never>,
} = {
  importDataset: {
    defaultType: 'empty',
    empty: {},
  },
}
