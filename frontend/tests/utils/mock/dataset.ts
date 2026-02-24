import type { GqlQuery } from './_types';
import { GetDatasetByIdQuery, ListDatasetsAndAnalysisQuery, ListDatasetsQuery } from '../../../src/api/dataset';
import type { Colormap } from '../../../src/features/Colormap';
import { dataset, spectrogramAnalysis, USERS } from './types';

export const DATASET_QUERIES: {
  listDatasets: GqlQuery<ListDatasetsQuery>,
  getDatasetByID: GqlQuery<GetDatasetByIdQuery>,
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
            path: dataset.path,
            legacy: dataset.legacy,
            createdAt: dataset.createdAt,
            description: dataset.description,
            analysisCount: dataset.analysisCount,
            spectrogramCount: dataset.spectrogramCount,
            start: dataset.start,
            end: dataset.end,
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
        start: dataset.start,
        end: dataset.end,
      },
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
