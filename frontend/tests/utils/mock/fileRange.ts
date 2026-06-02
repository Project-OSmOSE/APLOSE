import { type GqlQuery } from './_types';
import type { FileRangesForPhaseQuery, UpdateFileRangesMutation } from '../../../src/features/AnnotationFileRange/';
import { fileRange, USERS } from './types';


export const FILE_RANGE_QUERIES: {
  fileRangesForPhase: GqlQuery<FileRangesForPhaseQuery>,
} = {
  fileRangesForPhase: {
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
