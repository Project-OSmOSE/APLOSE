import { type GqlQuery } from './_types';
import type {
  CreateFileRangeMutation,
  DeleteFileRangeMutation,
  FileRangesForPhaseQuery,
  ListFileRangesQuery,
  UpdateFileRangeMutation,
  UpdateFileRangesMutation,
} from '../../../src/features/AnnotationFileRange/';
import { fileRange, USERS } from './types';


export const FILE_RANGE_QUERIES: {
  fileRangesForPhase: GqlQuery<FileRangesForPhaseQuery>,
  listFileRanges: GqlQuery<ListFileRangesQuery>,
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
  createFileRange: GqlQuery<CreateFileRangeMutation, never>,
  updateFileRange: GqlQuery<UpdateFileRangeMutation, never>,
  deleteFileRange: GqlQuery<DeleteFileRangeMutation, never>,
} = {
  updateFileRanges: {
    defaultType: 'empty',
    empty: {},
  },
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
