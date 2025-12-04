import { AnnotationPhaseType } from '../../../src/api/types.gql-generated';
import type {
  CreateAnnotationPhaseMutation,
  CreateVerificationPhaseMutation,
  EndPhaseMutation,
  GetAnnotationPhaseQuery,
} from '../../../src/api/annotation-phase';
import type { GqlQuery, RestQuery } from './_types';
import { DOWNLOAD_ANNOTATIONS_URL, DOWNLOAD_PROGRESS_URL } from '../../../src/consts/links';
import { completedTasksCount, phase, tasksCount, userCompletedTasksCount, userTasksCount } from './types';

export const PHASE_QUERIES: {
  getAnnotationPhase: GqlQuery<GetAnnotationPhaseQuery, `${ AnnotationPhaseType }` | `manager${ AnnotationPhaseType }`>,
} = {
  getAnnotationPhase: {
    defaultType: AnnotationPhaseType.Annotation,
    empty: {
      annotationPhaseByCampaignPhase: null,
    },
    managerAnnotation: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasksCount,
        tasksCount,
        userCompletedTasksCount,
        userTasksCount,
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: true,
      },
    },
    managerVerification: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Verification,
        completedTasksCount,
        tasksCount,
        userCompletedTasksCount,
        userTasksCount,
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: true,
      },
    },
    Annotation: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasksCount,
        tasksCount,
        userCompletedTasksCount,
        userTasksCount,
        endedAt: phase.endedAt,
        hasAnnotations: phase.hasAnnotations,
        canManage: false,
      },
    },
    Verification: {
      annotationPhaseByCampaignPhase: {
        id: phase.id,
        phase: AnnotationPhaseType.Annotation,
        completedTasksCount,
        tasksCount,
        userCompletedTasksCount,
        userTasksCount,
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
    url: DOWNLOAD_ANNOTATIONS_URL(phase.id),
    success: { status: 200, json: undefined },
  },
  downloadProgress: {
    url: DOWNLOAD_PROGRESS_URL(phase.id),
    success: { status: 200, json: undefined },
  },
}

export const PHASE_MUTATIONS: {
  endPhase: GqlQuery<EndPhaseMutation, never>,
  createAnnotationPhase: GqlQuery<CreateAnnotationPhaseMutation, never>,
  createVerificationPhase: GqlQuery<CreateVerificationPhaseMutation, never>,
} = {
  endPhase: {
    defaultType: 'empty',
    empty: {},
  },
  createAnnotationPhase: {
    defaultType: 'empty',
    empty: {},
  },
  createVerificationPhase: {
    defaultType: 'empty',
    empty: {},
  },
}
