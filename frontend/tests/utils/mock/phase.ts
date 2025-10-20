import { type AnnotationPhaseNode, AnnotationPhaseType } from '../../../src/api';
import { campaign } from './campaign';

export type Phase =
  Omit<AnnotationPhaseNode, 'annotationComments' | 'annotationFileRanges' | 'createdBy' | 'annotationTasks' | 'annotations' | 'annotationCampaign' | 'endedBy'>

export const phase: Phase = {
  id: '1',
  annotationCampaignId: campaign.id,
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