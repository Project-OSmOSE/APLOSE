import type { GqlQuery } from './_types';
import {
  GetDatasetByIdQuery,
  ImportNewDatasetMutation,
  ListAvailableDatasetsForImportQuery,
  ListDatasetsAndAnalysisQuery,
  ListDatasetsQuery,
} from '../../../src/api/dataset';
import type { Colormap } from '../../../src/features/Colormap';
import { dataset, DATASET_END, DATASET_FILES_COUNT, DATASET_START, spectrogramAnalysis, USERS } from './types';

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
            analysisCount: 1,
            spectrogramCount: DATASET_FILES_COUNT,
            start: DATASET_START,
            end: DATASET_END,
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
        start: DATASET_START,
        end: DATASET_END,
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
