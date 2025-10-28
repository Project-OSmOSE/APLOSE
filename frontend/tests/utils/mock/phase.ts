import { type AnnotationPhaseNode, AnnotationPhaseType } from '../../../src/api/types.gql-generated';
import type { GetAnnotationPhaseQuery } from '../../../src/api/annotation-phase';
import type { GqlQuery, RestQuery } from './_types';
import type {
  ArchiveAnnotationCampaignMutation,
  CreateAnnotationCampaignMutation,
  UpdateAnnotationCampaignFeaturedLabelsMutation,
} from '../../../src/api';
import { DOWNLOAD_ANNOTATIONS, DOWNLOAD_PROGRESS } from '../../../src/consts/links';

export type Phase =
    Omit<AnnotationPhaseNode, 'annotationComments' | 'annotationFileRanges' | 'createdBy' | 'annotationTasks' | 'annotations' | 'annotationCampaign' | 'endedBy' | 'annotationCampaignId' | 'phase' | 'canManage'>

export const phase: Phase = {
  id: '1',
  createdAt: new Date().toISOString(),
  endedAt: null,
  hasAnnotations: true,
  isOpen: true,
  isCompleted: false,
}
export const completedTasksCount = 50;
export const tasksCount = 100;
export const userCompletedTasksCount = 5;
export const userTasksCount = 10;

export const PHASE_QUERIES: {
  getAnnotationPhase: GqlQuery<GetAnnotationPhaseQuery, AnnotationPhaseType | 'manager'>,
} = {
  getAnnotationPhase: {
    defaultType: AnnotationPhaseType.Annotation,
    empty: {
      annotationPhaseByCampaignPhase: null,
    },
    manager: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasks: { totalCount: completedTasksCount },
        fileRanges: { tasksCount },
        userCompletedTasks: { totalCount: userCompletedTasksCount },
        userFileRanges: { tasksCount: userTasksCount },
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: true,
      },
    },
    Annotation: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasks: { totalCount: completedTasksCount },
        fileRanges: { tasksCount },
        userCompletedTasks: { totalCount: userCompletedTasksCount },
        userFileRanges: { tasksCount: userTasksCount },
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: false,
      },
    },
    Verification: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasks: { totalCount: completedTasksCount },
        fileRanges: { tasksCount },
        userCompletedTasks: { totalCount: userCompletedTasksCount },
        userFileRanges: { tasksCount: userTasksCount },
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: false,
      },
    },
  },
}

export const PHASE_DOWNLOADS: {
  downloadAnnotations: RestQuery<undefined>
  downloadProgress: RestQuery<undefined>
} = {
  downloadAnnotations: {
    url: DOWNLOAD_ANNOTATIONS(phase.id),
    success: { status: 200, json: undefined },
  },
  downloadProgress: {
    url: DOWNLOAD_PROGRESS(phase.id),
    success: { status: 200, json: undefined },
  },
}

export const PHASE_MUTATIONS: {
  endPhase: GqlQuery<CreateAnnotationCampaignMutation, never>,
  createAnnotationPhase: GqlQuery<ArchiveAnnotationCampaignMutation, never>,
  createVerificationPhase: GqlQuery<UpdateAnnotationCampaignFeaturedLabelsMutation, never>,
} = {
  endPhase: {
    defaultType: 'empty',
    empty: {},
  },
  createAnnotationPhase: {
    defaultType: 'empty',
    empty: {
      ok: true,
    },
  },
  createVerificationPhase: {
    defaultType: 'empty',
    empty: {},
  },
}
