import type { AllLabelsQuery } from '../../../src/features/Mx/Ontology/api/Ontology.generated';
import type { GqlQuery } from './_types';
import { LABELS } from './types';

export const LABEL_QUERIES: {
  allLabels: GqlQuery<AllLabelsQuery>,
} = {
  allLabels: {
    defaultType: 'filled',
    empty: {
      allLabels: null,
    },
    filled: {
      allLabels: {
        results: Object.values(LABELS)
      },
    },
  },
}
