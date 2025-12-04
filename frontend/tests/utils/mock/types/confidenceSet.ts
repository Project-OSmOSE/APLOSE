import { type ConfidenceNode, type ConfidenceSetNode, type Maybe } from '../../../../src/api/types.gql-generated';

export type Confidence = Omit<ConfidenceNode, 'confidenceIndicatorSets' | 'annotationSet'>
export const CONFIDENCES: { [key in 'sure' | 'notSure']: Confidence } = {
  sure: {
    id: '1',
    level: 1,
    isDefault: true,
    label: 'sure',
  },
  notSure: {
    id: '2',
    level: 0,
    isDefault: false,
    label: 'not sure',
  },
}

export type ConfidenceSet = Omit<ConfidenceSetNode, 'annotationcampaignSet' | 'confidenceIndicators'> & {
  confidenceIndicators?: Maybe<Array<Maybe<Confidence>>>;
}
export const confidenceSet: ConfidenceSet = {
  id: '1',
  name: 'Test confidence set',
  desc: 'My test confidence indicator set',
  confidenceIndicators: [ CONFIDENCES.sure, CONFIDENCES.notSure ],
}