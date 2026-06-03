import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllAnnotationSpectrogramsDocument,
    type AllAnnotationSpectrogramsQuery,
    type AllAnnotationSpectrogramsQueryVariables,
    GetAnnotationSpectrogramDocument,
    GetAnnotationSpectrogramPathsDocument,
    type GetAnnotationSpectrogramPathsQuery,
    type GetAnnotationSpectrogramPathsQueryVariables,
    type GetAnnotationSpectrogramQuery,
    type GetAnnotationSpectrogramQueryVariables,
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

export const getQuery = (variables: GetAnnotationSpectrogramQueryVariables) => queryOptions({
    queryKey: queryKeys.spectrogram.get(variables),
    queryFn: () => graphqlClient.request<GetAnnotationSpectrogramQuery>(GetAnnotationSpectrogramDocument, variables)
        .then(data => ({
            spectrogram: data.annotationSpectrogramById,
            annotations: [
                ...cleanGqlList(data.annotationSpectrogramById?.task?.userAnnotations?.results),
                ...cleanGqlList(data.annotationSpectrogramById?.task?.annotationsToCheck?.results),
            ],
            info: data.allAnnotationSpectrograms,
            isEditionAuthorized: data.annotationSpectrogramById?.isAssigned,
        })),
})

export const getPathQuery = (variables: GetAnnotationSpectrogramPathsQueryVariables) => queryOptions({
    queryKey: queryKeys.spectrogram.getPath(variables),
    queryFn: () => graphqlClient.request<GetAnnotationSpectrogramPathsQuery>(GetAnnotationSpectrogramPathsDocument, variables)
        .then(data => data.spectrogramPaths),
})

export type AllSpectrogramsFilters =
    Pick<AllAnnotationSpectrogramsQueryVariables, 'search' | 'status' | 'from' | 'to' | 'withAnnotations' | 'annotationLabel' | 'annotationConfidence' | 'annotationDetector' | 'annotationAnnotator' | 'withAcousticFeatures' | 'onlyAssigned'>
    & {
    page: number
}

export type * from './annotation-spectrogram.generated'