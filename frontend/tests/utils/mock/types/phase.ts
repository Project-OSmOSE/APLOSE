import { type AnnotationPhaseNode } from '../../../../src/api/types.gql-generated';

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
