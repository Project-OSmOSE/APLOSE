import {type GqlQuery} from './_types';
import type {AnnotationFileRangeNode} from '../../../src/api/types.gql-generated';
import type {ListFileRangesQuery, UpdateFileRangesMutation} from '../../../src/api/annotation-file-range/';
import {USERS} from './user';

const start = new Date()
const end = new Date()
end.setSeconds(end.getSeconds() + 10 * 2)
export type FileRange = Omit<AnnotationFileRangeNode,
    'annotator' | 'annotationPhase' | 'annotationTasks' | 'spectrograms'
>
export const fileRange: FileRange = {
    id: '1',
    firstFileIndex: 1,
    lastFileIndex: 2,
    filesCount: 2,
    fromDatetime: start,
    toDatetime: end,
}

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
                results: [{
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
                }],
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
