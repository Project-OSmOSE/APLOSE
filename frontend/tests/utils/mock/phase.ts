import { type AnnotationPhaseNode, AnnotationPhaseType } from '../../../src/api/types.gql-generated';

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