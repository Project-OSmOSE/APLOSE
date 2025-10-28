import { type GqlQuery, mockGqlError } from './_types';
import { type AnnotationCampaignNode, AnnotationPhaseType } from '../../../src/api/types.gql-generated';
import type {
  ArchiveAnnotationCampaignMutation,
  CreateAnnotationCampaignMutation,
  CreateAnnotationCampaignMutationVariables,
  GetCampaignQuery,
  ListCampaignsAndPhasesQuery,
  UpdateAnnotationCampaignFeaturedLabelsMutation,
} from '../../../src/api/annotation-campaign';
import { dataset, DATASET_FILES_COUNT } from './dataset';
import { completedTasksCount, phase, tasksCount, userCompletedTasksCount, userTasksCount } from './phase';
import { USERS } from './user';
import { confidenceSet } from './confidenceSet';
import { spectrogramAnalysis } from './spectrogramAnalysis';
import { fft } from './fft';
import { colormap } from './colormap';
import { legacyConfiguration } from './legacyConfiguration';
import { LABELS, labelSet } from './labelSet';

const deadline = new Date()
deadline.setTime(0)

export type Campaign = Omit<AnnotationCampaignNode,
    'dataset' | 'annotators' | 'confidenceSet' | 'owner' | 'analysis' | 'archive' | 'labelSet' | 'labelsWithAcousticFeatures' | 'detectors' | 'phases' | 'canManage'
>
export const campaign: Campaign = {
  id: '1',
  name: 'Test campaign',
  description: 'Test campaign description',
  isArchived: false,
  deadline: deadline.toISOString().split('T')[0],
  allowColormapTuning: false,
  allowImageTuning: false,
  allowPointAnnotation: false,
  colormapDefault: null,
  colormapInvertedDefault: null,
  createdAt: new Date().toISOString(),
  instructionsUrl: 'myinstructions.co',
}

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
    spectrograms: {
      totalCount: DATASET_FILES_COUNT
    },
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
    annotators: [{
      id: USERS.annotator.id,
      displayName: USERS.annotator.displayName,
    }],
    confidenceSet: {
      name: confidenceSet.name,
      desc: confidenceSet.desc,
      confidenceIndicators: confidenceSet.confidenceIndicators.map(c => ({
        label: c.label,
      })),
    },
    analysis: {
      edges: [{
        node: {
          id: spectrogramAnalysis.id,
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
      }],
    },
    detectors: [],
    labelSet,
    labelsWithAcousticFeatures: [{
      id: LABELS.featured.id,
      name: LABELS.featured.name,
    }],
  },
  allAnnotationPhases: {
    results: [{
      id: phase.id,
      phase: AnnotationPhaseType.Annotation,
      fileRanges: { tasksCount },
      completedTasks: { totalCount: completedTasksCount },
      isOpen: phase.isOpen,
    }, {
      id: '2',
      phase: AnnotationPhaseType.Verification,
      fileRanges: { tasksCount },
      completedTasks: { totalCount: completedTasksCount },
      isOpen: phase.isOpen,
    }],
  },
}
export const CAMPAIGN_QUERIES: {
  listCampaignsAndPhases: GqlQuery<ListCampaignsAndPhasesQuery>,
  getCampaign: GqlQuery<GetCampaignQuery, 'default' | 'manager'>,
} = {
  listCampaignsAndPhases: {
    defaultType: 'filled',
    empty: {
      allAnnotationCampaigns: null,
      allAnnotationPhases: null,
    },
    filled: {
      allAnnotationCampaigns: {
        results: [
          {
            id: campaign.id,
            name: campaign.name,
            dataset: {
              name: campaign.name
            },
            isArchived: campaign.isArchived,
            deadline: campaign.deadline,
          },
        ],
      },
      allAnnotationPhases: {
        results: [
          {
            id: phase.id,
            annotationCampaignId: campaign.id,
            phase: AnnotationPhaseType.Annotation,
            fileRanges: { tasksCount },
            completedTasks: { totalCount: completedTasksCount },
            userFileRanges: { tasksCount: userTasksCount },
            userCompletedTasks: { totalCount: userCompletedTasksCount },
          },
        ],
      },
    },
  },
  getCampaign: {
    defaultType: 'default',
    empty: {
      annotationCampaignById: null,
      allAnnotationPhases: null,
    },
    default: DEFAULT_GET_CAMPAIGN,
    manager: {
      ...DEFAULT_GET_CAMPAIGN,
      annotationCampaignById: {
        ...DEFAULT_GET_CAMPAIGN.annotationCampaignById,
        canManage: true,
      },
    },
  },
}

export const CAMPAIGN_MUTATIONS: {
  createAnnotationCampaign: GqlQuery<CreateAnnotationCampaignMutation, 'filled' | 'failed'>,
  archiveAnnotationCampaign: GqlQuery<ArchiveAnnotationCampaignMutation, never>,
  updateAnnotationCampaignFeaturedLabels: GqlQuery<UpdateAnnotationCampaignFeaturedLabelsMutation, never>,
} = {
  createAnnotationCampaign: {
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
          mockGqlError<CreateAnnotationCampaignMutationVariables>('name'),
          mockGqlError<CreateAnnotationCampaignMutationVariables>('description'),
          mockGqlError<CreateAnnotationCampaignMutationVariables>('instructionsUrl'),
          mockGqlError<CreateAnnotationCampaignMutationVariables>('deadline'),
          mockGqlError<CreateAnnotationCampaignMutationVariables>('datasetID'),
          mockGqlError<CreateAnnotationCampaignMutationVariables>('analysisIDs'),
          mockGqlError<CreateAnnotationCampaignMutationVariables>('colormapDefault'),
        ],
      },
    },
  },
  archiveAnnotationCampaign: {
    defaultType: 'empty',
    empty: {},
  },
  updateAnnotationCampaignFeaturedLabels: {
    defaultType: 'empty',
    empty: {},
  },
}
