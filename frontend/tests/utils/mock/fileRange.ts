import { type GqlQuery } from './_types';
import type {
  CreateFileRangeMutation,
  DeleteFileRangeMutation,
  ListFileRangesQuery,
  UpdateFileRangeMutation,
} from '../../../src/features/AnnotationFileRange/';
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
  createFileRange: GqlQuery<CreateFileRangeMutation, never>,
  updateFileRange: GqlQuery<UpdateFileRangeMutation, never>,
  deleteFileRange: GqlQuery<DeleteFileRangeMutation, never>,
} = {
  createFileRange: {
    defaultType: 'empty',
    empty: {},
  },
  updateFileRange: {
    defaultType: 'empty',
    empty: {},
  },
  deleteFileRange: {
    defaultType: 'empty',
    empty: {},
  },
}
