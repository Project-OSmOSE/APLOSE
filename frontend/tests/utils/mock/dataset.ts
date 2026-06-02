import type { GqlQuery } from './_types';
import { AllDatasetsQuery, GetDatasetByIdQuery, ListDatasetsWithAnalysisQuery } from '../../../src/features/Dataset';
import type { Colormap } from '../../../src/features/Colormap';
import { dataset, spectrogramAnalysis, USERS } from './types';

export const DATASET_QUERIES: {
  allDatasets: GqlQuery<AllDatasetsQuery>,
  getDatasetByID: GqlQuery<GetDatasetByIdQuery>,
  listDatasetsWithAnalysis: GqlQuery<ListDatasetsWithAnalysisQuery>,
} = {
  allDatasets: {
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
            annotationCampaigns: {
              edges: [],
            },
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
        analysisCount: dataset.analysisCount,
        spectrogramCount: dataset.spectrogramCount,
      },
    },
  },
  listDatasetsWithAnalysis: {
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
