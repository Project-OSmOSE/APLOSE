import { type AnnotationPhaseNode, AnnotationPhaseType } from '../../../src/api/types.gql-generated';
import type { GetAnnotationPhaseQuery } from '../../../src/api/annotation-phase';
import type { GqlQuery } from './_types';
import type {
  ArchiveAnnotationCampaignMutation,
  CreateAnnotationCampaignMutation,
  UpdateAnnotationCampaignFeaturedLabelsMutation,
} from '../../../src/api';

export type Phase =
  Omit<AnnotationPhaseNode, 'annotationComments' | 'annotationFileRanges' | 'createdBy' | 'annotationTasks' | 'annotations' | 'annotationCampaign' | 'endedBy' | 'annotationCampaignId'>

export const phase: Phase = {
  id: '1',
  phase: AnnotationPhaseType.Annotation,
  completedTasksCount: 50,
  tasksCount: 100,
  userCompletedTasksCount: 5,
  userTasksCount: 10,
  createdAt: new Date().toISOString(),
  endedAt: null,
  hasAnnotations: true,
  canManage: true,
  isOpen: true,
  isCompleted: false,
}

export const PHASE_QUERIES: {
  getAnnotationPhase: GqlQuery<GetAnnotationPhaseQuery, AnnotationPhaseType>,
} = {
  getAnnotationPhase: {
    defaultType: AnnotationPhaseType.Annotation,
    empty: {
      annotationPhaseByCampaignPhase: null,
    },
    Annotation: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasksCount: phase.completedTasksCount,
        tasksCount: phase.tasksCount,
        userCompletedTasksCount: phase.userCompletedTasksCount,
        userTasksCount: phase.userTasksCount,
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: phase.canManage,
      },
    },
    Verification: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasksCount: phase.completedTasksCount,
        tasksCount: phase.tasksCount,
        userCompletedTasksCount: phase.userCompletedTasksCount,
        userTasksCount: phase.userTasksCount,
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: phase.canManage,
      },
    },
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
