import { type GqlQuery } from './_types';
import type { ListFileRangesQuery, UpdateFileRangesMutation } from '../../../src/api/annotation-file-range/';
import { fileRange, USERS } from './types';


export const FILE_RANGE_QUERIES: {
  listFileRanges: GqlQuery<ListFileRangesQuery>,
} = {
  listFileRanges: {
    defaultType: 'filled',
    empty: {
      allAnnotationFileRanges: null,
    },
    filled: {
      allAnnotationFileRanges: {
        results: [ {
          id: fileRange.id,
          annotator: {
            id: USERS.annotator.id,
            displayName: USERS.annotator.displayName,
          },
          firstFileIndex: fileRange.firstFileIndex,
          lastFileIndex: fileRange.lastFileIndex,
          filesCount: 2,
          completedAnnotationTasks: {
            totalCount: 1,
          },
        } ],
      },
    },
  },
}

export const FILE_RANGE_MUTATIONS: {
  updateFileRanges: GqlQuery<UpdateFileRangesMutation, never>,
} = {
  updateFileRanges: {
    defaultType: 'empty',
    empty: {},
  },
}
