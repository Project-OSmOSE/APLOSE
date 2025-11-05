import { useAppDispatch, useAppSelector } from '@/features/App';
import { useCallback, useMemo } from 'react';
import {
  addAnnotation,
  type Annotation,
  blur,
  focusAnnotation,
  removeAnnotation,
  selectAllAnnotations,
  selectID,
  updateAnnotation,
} from './slice';
import { getNewItemID } from '@/service/function';
import { AnnotationType, useCurrentUser } from '@/api';
import { useAnnotatorConfidence } from '@/features/Annotator/Confidence';
import { type AploseNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';

type AnnotationEqualsType = Pick<Annotation, 'label' | 'confidence' | 'startTime' | 'endTime' | 'startFrequency' | 'endFrequency'>


export const useAnnotatorAnnotation = () => {
  const { phaseType } = useParams<AploseNavParams>();
  const { user } = useCurrentUser();
  const { focusedConfidence } = useAnnotatorConfidence()
  const allAnnotations = useAppSelector(state => selectAllAnnotations(state.annotator));
  const focusedAnnotationID = useAppSelector(state => selectID(state.annotator));
  const focusedAnnotation = useMemo(() => {
    return allAnnotations?.find(a => a.id === focusedAnnotationID);
  }, [ allAnnotations, focusedAnnotationID ])
  const dispatch = useAppDispatch();

  const _equals = useCallback((a: AnnotationEqualsType, b: AnnotationEqualsType): boolean => {
    return a.label === b.label
      && a.confidence === b.confidence
      && a.startTime === b.startTime
      && a.endTime === b.endTime
      && a.startFrequency === b.startFrequency
      && a.endFrequency === b.endFrequency
  }, [])

  // Validation
  const _getNewValidationID = useCallback(() => {
    return getNewItemID(allAnnotations.map(a => a.validation).filter(v => v !== undefined).map(v => v!))
  }, [ allAnnotations ])
  const _updateValidation = useCallback((isValid: boolean, validation?: Annotation['validation']): Annotation['validation'] => {
    return validation ? { ...validation, isValid } : { isValid, id: _getNewValidationID() }
  }, [ _getNewValidationID ])
  const validate = useCallback((annotation: Annotation): Annotation => {
    annotation = dispatch(updateAnnotation({
      id: annotation.id,
      validation: _updateValidation(true, annotation.validation),
      update: undefined,
    })).payload as Annotation
    if (annotation.type === AnnotationType.Weak) {
      const strongAnnotations = allAnnotations.filter(a => a.type !== AnnotationType.Weak && a.label === annotation.label);
      for (const a of strongAnnotations) {
        dispatch(updateAnnotation({
          id: a.id,
          validation: _updateValidation(true, a.validation),
          update: undefined,
        }))
      }
    }
    dispatch(focusAnnotation(annotation))
    return annotation
  }, [ allAnnotations, _updateValidation ])
  const invalidate = useCallback((annotation: Annotation): Annotation => {
    annotation = dispatch(updateAnnotation({
      id: annotation.id,
      validation: _updateValidation(false, annotation.validation),
    })).payload as Annotation
    const otherStrongValidAnnotations = allAnnotations.filter(a => {
      if (a.type === AnnotationType.Weak) return false;
      if (a.label !== annotation.label) return false;
      return a.validation?.isValid
    });
    const weakAnnotation = allAnnotations.find(a => a.type === AnnotationType.Weak && a.label === annotation.label);
    if (annotation.type !== AnnotationType.Weak && otherStrongValidAnnotations.length === 0 && weakAnnotation) {
      dispatch(updateAnnotation({
        id: weakAnnotation.id,
        validation: _updateValidation(false, weakAnnotation.validation),
      }))
    }
    dispatch(focusAnnotation(annotation))
    return annotation
  }, [ allAnnotations, _updateValidation ])

  // CRUD
  const _getNewAnnotationID = useCallback(() => {
    return getNewItemID([ ...allAnnotations, ...allAnnotations.filter(a => !!a.update).map(a => a.update!) ])
  }, [ allAnnotations ])
  const _filterAnnotations = useCallback((annotation: Annotation, properties: Partial<Annotation>): boolean => {
    let result = true;
    for (const [ key, value ] of Object.entries(properties)) {
      result = result && annotation[key as keyof Annotation] === value
    }
    return result
  }, [])
  const getAnnotation = useCallback((properties: Partial<Annotation>) => {
    return allAnnotations.find(a => _filterAnnotations(a, properties));
  }, [ allAnnotations, _filterAnnotations ])
  const getAnnotations = useCallback((properties: Partial<Annotation>) => {
    return allAnnotations.filter(a => _filterAnnotations(a, properties));
  }, [ allAnnotations, _filterAnnotations ])
  const add = useCallback((annotation: Omit<Annotation, 'id' | 'analysis'>) => {
    const addedAnnotation = dispatch(addAnnotation({
      ...annotation,
      id: _getNewAnnotationID(),
    })).payload as Annotation
    dispatch(focusAnnotation(addedAnnotation))
  }, [ _getNewAnnotationID ])
  const remove = useCallback((annotation: Annotation) => {
    if (phaseType === 'Annotation' || annotation.annotator === user?.id) {
      dispatch(removeAnnotation(annotation))
      const weak = allAnnotations.find(a => a.type === AnnotationType.Weak && a.label === annotation.label && a.id !== annotation.id);
      if (weak) dispatch(focusAnnotation(weak))
      else dispatch(blur())
    } else {
      invalidate(annotation)
    }
  }, [ phaseType, allAnnotations, invalidate, getAnnotations ])
  const update = useCallback((annotation: Annotation, update: Partial<Annotation>) => {
    if (annotation.type === AnnotationType.Weak && 'label' in update) return;
    if (phaseType === 'Annotation' || annotation.annotator === user?.id) {
      annotation = dispatch(updateAnnotation({ id: annotation.id, ...update })).payload as Annotation
      if (update.label && !allAnnotations.find(a => a.label === update.label && a.type === AnnotationType.Weak)) {
        add({ type: AnnotationType.Weak, label: update.label, confidence: update.confidence ?? focusedConfidence })
      }
    } else {
      // Verification mode
      const annotationUpdate: Annotation = {
        ...annotation, // Base is initial annotation
        ...(annotation.update ?? { id: _getNewAnnotationID() }), // Add existing update info if exist
        ...update, // Update according provided info
      }
      if (_equals(annotation, annotationUpdate)) {
        annotation = validate(annotation)
      } else {
        annotation = dispatch(updateAnnotation({
          id: annotation.id,
          update: annotationUpdate,
        })).payload as Annotation
        annotation = invalidate(annotation)
      }
    }
    dispatch(focusAnnotation(annotation))
  }, [ phaseType, allAnnotations, add, focus, _equals, remove, validate, invalidate, user, _getNewAnnotationID, focusedConfidence ])

  // Acoustic features
  const _getNewFeaturesID = useCallback(() => {
    return getNewItemID(allAnnotations.filter(a => a.acousticFeatures).map(a => a.acousticFeatures!))
  }, [ allAnnotations ])
  const updateFeatures = useCallback((annotation: Annotation, update: Partial<Annotation['acousticFeatures']>) => {
    if (annotation.type === AnnotationType.Weak) return;
    const acousticFeatures = {
      ...(annotation.acousticFeatures ?? { id: _getNewFeaturesID() }),
      ...update,
    }
    annotation = dispatch(updateAnnotation({ id: annotation.id, acousticFeatures })).payload as Annotation
    dispatch(focusAnnotation(annotation))
  }, [ _getNewFeaturesID ])
  const removeFeatures = useCallback((annotation: Annotation) => {
    if (annotation.type === AnnotationType.Weak) return;
    annotation = dispatch(updateAnnotation({ id: annotation.id, acousticFeatures: undefined })).payload as Annotation
    dispatch(focusAnnotation(annotation))
  }, [])

  // Post

  return {
    allAnnotations,
    focus: useCallback((annotation: Annotation) => {
      dispatch(focusAnnotation(annotation))
    }, []),
    blur: useCallback(() => dispatch(blur()), []),
    focusedAnnotation,

    validate, invalidate,

    getAnnotation, getAnnotations,
    addAnnotation: add,
    updateAnnotation: update,
    removeAnnotation: remove,

    updateFeatures,
    removeFeatures,
  }
}
