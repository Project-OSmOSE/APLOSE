import type { GqlQuery } from './_types';
import {
  AllDatasetsQuery,
  AllDatasetsWithCampaignsQuery,
  GetDatasetByIdQuery,
} from '../../../src/features/Dataset/api/dataset.generated';
import { dataset, deployment, USERS } from './types';
import { ANALYSIS_QUERIES } from './spectrogramAnalysis';
import { CAMPAIGN_QUERIES } from './campaign';

export const DATASET_QUERIES: {
    allDatasets: GqlQuery<AllDatasetsQuery>,
    allDatasetsWithCampaigns: GqlQuery<AllDatasetsWithCampaignsQuery>,
    getDatasetByID: GqlQuery<GetDatasetByIdQuery, 'filled' | 'dataEmpty'>,
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
                        archived: dataset.archived,
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
                archived: dataset.archived,
                hasChangePermission: false,
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
                archived: dataset.archived,
                hasChangePermission: false,
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
            allAnnotationCampaigns: {
                results: CAMPAIGN_QUERIES.allCampaigns.filled.allAnnotationCampaigns.results.map(data => ({
                    ...data,
                    hasChangePermission: false,
                    phases: {
                        results: data.phases.results.map((dataPhase, index) => ({
                            ...dataPhase,
                            id: index.toString(),
                            userCompletedTasksCount: 2,
                            userTasksCount: 10,
                            completedTasksCount: 7,
                            tasksCount: 20,
                        }))
                    }
                }))
            },
        },
    },
}
