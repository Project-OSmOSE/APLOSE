import type { GqlQuery } from './_types';
import {
  AllDatasetsQuery,
  AllDatasetsWithCampaignsQuery,
  GetDatasetByIdQuery,
  ListDatasetsWithAnalysisQuery,
} from '../../../src/features/Dataset';
import type { Colormap } from '../../../src/features/Colormap';
import { dataset, deployment, spectrogramAnalysis, USERS } from './types';
import { ANALYSIS_QUERIES } from './spectrogramAnalysis';
import { CAMPAIGN_QUERIES } from './campaign';

export const DATASET_QUERIES: {
  allDatasets: GqlQuery<AllDatasetsQuery>,
  allDatasetsWithCampaigns: GqlQuery<AllDatasetsWithCampaignsQuery>,
  getDatasetByID: GqlQuery<GetDatasetByIdQuery, 'filled' |'dataEmpty'>,
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
          },
        ],
      },
    },
  },
  allDatasetsWithCampaigns: {
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
    empty: {
      datasetById: undefined,
      allSpectrogramAnalysis: undefined,
      allAnnotationCampaigns: undefined,
      allChannelConfigurations: undefined,
    },
    dataEmpty: {
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
      allSpectrogramAnalysis: undefined,
      allAnnotationCampaigns: undefined,
      allChannelConfigurations: undefined,
    },
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
      allChannelConfigurations: {
        results: [ { deployment } ],
      },
      allSpectrogramAnalysis: ANALYSIS_QUERIES.allSpectrogramAnalysis.filled.allSpectrogramAnalysis,
      allAnnotationCampaigns: CAMPAIGN_QUERIES.allCampaigns.filled.allAnnotationCampaigns,
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
