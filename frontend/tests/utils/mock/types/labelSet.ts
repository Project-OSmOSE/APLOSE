import { type AnnotationLabelNode, type LabelSetNode, type Maybe } from '../../../../src/api/types.gql-generated';

export type Label = Omit<AnnotationLabelNode, 'metadataxLabel' | 'annotationSet' | 'annotationcampaignSet' | 'labelsetSet'>
export const LABELS: { [key in 'classic' | 'featured']: Label } = {
  classic: {
    id: '1',
    name: 'Rain',
  },
  featured: {
    id: '2',
    name: 'Whistle',
  },
}

export type LabelSet = Omit<LabelSetNode, 'annotationcampaignSet' | 'labels'> & {
  labels: Array<Maybe<Label>>;
}
export const labelSet: LabelSet = {
  id: '1',
  name: 'Test label set',
  description: 'My testing label set',
  labels: Object.values(LABELS),
}
