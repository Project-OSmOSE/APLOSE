import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllAnnotationSpectrogramsDocument,
    type AllAnnotationSpectrogramsQuery,
    type AllAnnotationSpectrogramsQueryVariables,
} from './annotation-spectrogram.generated'
import { cleanGqlList } from '@/api/utils';

export const allQuery = (variables: AllAnnotationSpectrogramsQueryVariables) => queryOptions({
    queryKey: queryKeys.spectrogram.all(variables),
    queryFn: () => graphqlClient.request<AllAnnotationSpectrogramsQuery>(AllAnnotationSpectrogramsDocument, variables)
        .then(data => ({
            spectrograms: cleanGqlList(data.allAnnotationSpectrograms?.results),
            totalCount: data.allAnnotationSpectrograms?.totalCount,
            resumeId: data.allAnnotationSpectrograms?.resumeSpectrogramId,
    })),
})

export type AllSpectrogramsFilters =
    Pick<AllAnnotationSpectrogramsQueryVariables, 'search' | 'status' | 'from' | 'to' | 'withAnnotations' | 'annotationLabel' | 'annotationConfidence' | 'annotationDetector' | 'annotationAnnotator' | 'withAcousticFeatures' | 'onlyAssigned'>
    & {
    page: number
}

export type * from './annotation-spectrogram.generated'