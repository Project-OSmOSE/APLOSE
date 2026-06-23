import type { GqlQuery } from './_types';
import type { ListLabelSetsQuery } from '../../../src/features/labels/api';
import { labelSet } from './types';

export const LABEL_SET_QUERIES: {
  listLabelSets: GqlQuery<ListLabelSetsQuery>,
} = {
  listLabelSets: {
    defaultType: 'filled',
    empty: {
      allLabelSets: null,
    },
    filled: {
      allLabelSets: {
        results: [ labelSet ],
      },
    },
  },
}