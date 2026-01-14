import { type AnnotationCampaignNode } from '../../../../src/api/types.gql-generated';

const deadline = new Date()
deadline.setTime(0)

export type Campaign = Omit<AnnotationCampaignNode,
  'dataset' | 'annotators' | 'confidenceSet' | 'owner' | 'analysis' | 'archive' | 'labelSet' |
  'labelsWithAcousticFeatures' | 'detectors' | 'phases' | 'canManage' | 'datasetName' | 'completedTasksCount' |
  'tasksCount' | 'phaseTypes' | 'userTasksCount' | 'userCompletedTasksCount' | 'spectrogramsCount'
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
