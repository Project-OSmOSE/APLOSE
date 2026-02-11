import { useAppDispatch } from '@/features/App';
import { useCallback } from 'react';
import { type Annotation, focusAnnotation, updateAnnotation } from '@/features/Annotator/Annotation';
import { AnnotationType } from '@/api';

export const useUpdateAnnotationFeatures = () => {
    const dispatch = useAppDispatch();

    return useCallback((annotation: Annotation, update: Partial<Annotation['acousticFeatures']>) => {
        if (annotation.type === AnnotationType.Weak) return;
        const acousticFeatures = {
            ...(annotation.acousticFeatures ?? {}),
            ...update,
        }
        annotation = dispatch(updateAnnotation({ id: annotation.id, acousticFeatures })).payload as Annotation
        dispatch(focusAnnotation(annotation))
    }, [ dispatch ])
}

export const useRemoveAnnotationFeatures = () => {
    const dispatch = useAppDispatch();

    return useCallback((annotation: Annotation) => {
        if (annotation.type === AnnotationType.Weak) return;
        annotation = dispatch(updateAnnotation({ id: annotation.id, acousticFeatures: undefined })).payload as Annotation
        dispatch(focusAnnotation(annotation))
    }, [ dispatch ])
}

