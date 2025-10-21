import type { GqlQuery } from './_types';
import type {
  GetDatasetByIdQuery,
  ListAvailableDatasetsForImportQuery,
  ListDatasetsAndAnalysisQuery,
  ListDatasetsQuery,
} from '../../../src/api/dataset';
import type { DatasetNode } from '../../../src/api/types.gql-generated';
import type { Colormap } from '../../../src/features/Colormap';
import { USERS } from './user';

export type Dataset =
  Omit<DatasetNode, 'owner' | 'annotationCampaigns' | 'spectrogramAnalysis' | 'relatedChannelConfigurations'>

export const dataset: Dataset = {
  id: '1',
  name: 'Test dataset',
  path: 'test/dataset',
  description: 'Coastal audio recordings',
  start: '2021-08-02T00:00:00Z',
  end: '2022-07-13T06:00:00Z',
  filesCount: 99,
  createdAt: new Date().toISOString(),
  legacy: true,
  analysisCount: 1,
}

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
            start: dataset.start,
            end: dataset.end,
            filesCount: dataset.filesCount,
            description: dataset.description,
            analysisCount: dataset.analysisCount,
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
        start: dataset.start,
        end: dataset.end,
        description: dataset.description,
        path: dataset.path,
        owner: {
          displayName: USERS.creator.displayName,
        },
      },
    },
  },
  listAvailableDatasetsForImport: {
    defaultType: 'filled',
    empty: {
      allDatasetsAvailableForImport: [],
    },
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
            id: '1',
            name: 'Test dataset',
            spectrogramAnalysis: {
              edges: [
                {
                  node: {
                    id: '1',
                    name: 'Test analysis',
                    colormap: { name: 'Greys' as Colormap },
                  },
                },
              ],
            },
          },
        ],
      },
    },
  },
}

export type DatasetMutations = 'importDataset'
