import type { GqlQuery } from './_types';
import type { AnnotationCampaignNode } from '../../../src/api/types.gql-generated';
import type { GetCampaignQuery, ListCampaignsAndPhasesQuery } from '../../../src/api/annotation-campaign';
import { dataset } from './dataset';
import { phase } from './phase';
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
  datasetName: dataset.name,
  isArchived: false,
  deadline: deadline.toISOString().split('T')[0],
  allowColormapTuning: false,
  allowImageTuning: false,
  allowPointAnnotation: false,
  colormapDefault: null,
  colormapInvertedDefault: null,
  createdAt: new Date().toISOString(),
  filesCount: dataset.filesCount,
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
    filesCount: campaign.filesCount,
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
      name: confidenceSet.name,
      desc: confidenceSet.desc,
      confidenceIndicators: confidenceSet.confidenceIndicators.map(c => ({
        label: c.label,
      })),
    },
    analysis: {
      edges: [ {
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
      } ],
    },
    detectors: [],
    labelSet,
    labelsWithAcousticFeatures: [ {
      id: LABELS.featured.id,
      name: LABELS.featured.name,
    } ],
  },
  allAnnotationPhases: {
    results: [ {
      id: phase.id,
      phase: phase.phase,
      completedTasksCount: phase.completedTasksCount,
      tasksCount: phase.tasksCount,
      isOpen: phase.isOpen,
    } ],
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
            datasetName: campaign.name,
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
            phase: phase.phase,
            completedTasksCount: phase.completedTasksCount,
            tasksCount: phase.tasksCount,
            userCompletedTasksCount: phase.userCompletedTasksCount,
            userTasksCount: phase.userTasksCount,
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

export type CampaignMutations =
  'createAnnotationCampaign'
  | 'archiveAnnotationCampaign'
  | 'updateAnnotationCampaignFeaturedLabels'
