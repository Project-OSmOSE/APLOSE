import { type GqlQuery, mockGqlError } from './_types';
import { AnnotationPhaseType } from '../../../src/api/types.gql-generated';
import type {
  ArchiveCampaignMutation,
  CreateCampaignMutation,
  CreateCampaignMutationVariables,
  GetCampaignQuery,
  ListCampaignsQuery,
  UpdateCampaignFeaturedLabelsMutation,
} from '../../../src/api/annotation-campaign';
import {
  campaign,
  colormap,
  completedTasksCount,
  CONFIDENCES,
  confidenceSet,
  dataset,
  fft,
  LABELS,
  labelSet,
  legacyConfiguration,
  phase,
  spectrogramAnalysis,
  tasksCount,
  userCompletedTasksCount,
  USERS,
  userTasksCount,
} from './types';

const DEFAULT_GET_CAMPAIGN: GetCampaignQuery = {
  annotationCampaignById: {
    id: campaign.id,
    name: campaign.name,
    isArchived: campaign.isArchived,
    deadline: campaign.deadline,
    allowColormapTuning: campaign.allowColormapTuning,
    archive: null,
    createdAt: campaign.createdAt,
    allowImageTuning: campaign.allowImageTuning,
    allowPointAnnotation: campaign.allowPointAnnotation,
    canManage: false,
    colormapDefault: campaign.colormapDefault,
    colormapInvertedDefault: campaign.colormapInvertedDefault,
    description: campaign.description,
    spectrogramsCount: dataset.spectrogramCount,
    instructionsUrl: campaign.instructionsUrl,
    owner: {
      id: USERS.creator.id,
      email: USERS.creator.email,
      displayName: USERS.creator.displayName,
    },
    dataset: {
      id: dataset.id,
      name: dataset.name,
    },
    annotators: [ {
      id: USERS.annotator.id,
      displayName: USERS.annotator.displayName,
    } ],
    confidenceSet: {
      id: confidenceSet.id,
      name: confidenceSet.name,
      desc: confidenceSet.desc,
      confidenceIndicators: confidenceSet.confidenceIndicators.map(c => ({
        label: c.label,
        isDefault: c.label === CONFIDENCES.sure.label,
      })),
    },
    analysis: {
      edges: [ {
        node: {
          id: spectrogramAnalysis.id,
          name: spectrogramAnalysis.name,
          legacy: spectrogramAnalysis.legacy,
          fft: {
            nfft: fft.nfft,
            overlap: fft.overlap,
            samplingFrequency: fft.samplingFrequency,
            windowSize: fft.windowSize,
          },
          colormap: {
            name: colormap.name,
          },
          legacyConfiguration: {
            scaleName: legacyConfiguration.scaleName,
            linearFrequencyScale: legacyConfiguration.linearFrequencyScale,
            multiLinearFrequencyScale: legacyConfiguration.multiLinearFrequencyScale,
            zoomLevel: legacyConfiguration.zoomLevel,
          },
        },
      } ],
    },
    detectors: [],
    labelSet,
    labelsWithAcousticFeatures: [ {
      id: LABELS.featured.id,
      name: LABELS.featured.name,
    } ],
    phases: {
      results: [ {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        tasksCount,
        completedTasksCount,
        isOpen: phase.isOpen,
      }, {
        id: '2',
        phase: AnnotationPhaseType.Verification,
        tasksCount,
        completedTasksCount,
        isOpen: phase.isOpen,
      } ],
    },
  },
}
export const CAMPAIGN_QUERIES: {
  listCampaigns: GqlQuery<ListCampaignsQuery>,
  getCampaign: GqlQuery<GetCampaignQuery, 'default' | 'manager' | 'withoutConfidence' | 'allowPoint' | 'multipleAnalysis'>,
} = {
  listCampaigns: {
    defaultType: 'filled',
    empty: {
      allAnnotationCampaigns: null,
    },
    filled: {
      allAnnotationCampaigns: {
        results: [
          {
            id: campaign.id,
            name: campaign.name,
            datasetName: dataset.name,
            isArchived: campaign.isArchived,
            deadline: campaign.deadline,
            tasksCount,
            completedTasksCount,
            userTasksCount,
            userCompletedTasksCount,
            phaseTypes: [ AnnotationPhaseType.Annotation ],
            accessiblePhases: {
              results: [ { phase: AnnotationPhaseType.Annotation } ]
            },
          },
        ],
      },
    },
  },
  getCampaign: {
    defaultType: 'default',
    empty: {
      annotationCampaignById: null,
    },
    default: DEFAULT_GET_CAMPAIGN,
    manager: {
      ...DEFAULT_GET_CAMPAIGN,
      annotationCampaignById: {
        ...DEFAULT_GET_CAMPAIGN.annotationCampaignById,
        canManage: true,
      },
    },
    withoutConfidence: {
      ...DEFAULT_GET_CAMPAIGN,
      annotationCampaignById: {
        ...DEFAULT_GET_CAMPAIGN.annotationCampaignById,
        confidenceSet: null,
      },
    },
    allowPoint: {
      ...DEFAULT_GET_CAMPAIGN,
      annotationCampaignById: {
        ...DEFAULT_GET_CAMPAIGN.annotationCampaignById,
        allowPointAnnotation: true,
      },
    },
    multipleAnalysis: {
      ...DEFAULT_GET_CAMPAIGN,
      annotationCampaignById: {
        ...DEFAULT_GET_CAMPAIGN.annotationCampaignById,
        analysis: {
          edges: [
            { node: { ...DEFAULT_GET_CAMPAIGN.annotationCampaignById.analysis.edges[0].node, id: '1' } },
            { node: { ...DEFAULT_GET_CAMPAIGN.annotationCampaignById.analysis.edges[0].node, id: '2' } },
          ],
        },
      },
    },
  },
}

export const CAMPAIGN_MUTATIONS: {
  createCampaign: GqlQuery<CreateCampaignMutation, 'filled' | 'failed'>,
  archiveCampaign: GqlQuery<ArchiveCampaignMutation, never>,
  updateCampaignFeaturedLabels: GqlQuery<UpdateCampaignFeaturedLabelsMutation, never>,
} = {
  createCampaign: {
    defaultType: 'filled',
    empty: {},
    filled: {
      createAnnotationCampaign: {
        annotationCampaign: {
          id: campaign.id,
        },
        errors: [],
      },
    },
    failed: {
      createAnnotationCampaign: {
        errors: [
          mockGqlError<CreateCampaignMutationVariables>('name'),
          mockGqlError<CreateCampaignMutationVariables>('description'),
          mockGqlError<CreateCampaignMutationVariables>('instructionsUrl'),
          mockGqlError<CreateCampaignMutationVariables>('deadline'),
          mockGqlError<CreateCampaignMutationVariables>('datasetID'),
          mockGqlError<CreateCampaignMutationVariables>('analysisIDs'),
          mockGqlError<CreateCampaignMutationVariables>('colormapDefault'),
        ],
      },
    },
  },
  archiveCampaign: {
    defaultType: 'empty',
    empty: {},
  },
  updateCampaignFeaturedLabels: {
    defaultType: 'empty',
    empty: {},
  },
}
