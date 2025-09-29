import { useCallback, useMemo } from "react";
import {
  AnnotationLabelNode,
  AnnotationNode,
  AnnotationType,
  AnnotationValidationNode,
  ConfidenceNode
} from "@/features/_utils_/gql/types.generated.ts";
import { useAppDispatch, useAppSelector } from "@/service/app.ts";
import {
  AddAnnotation,
  Annotation,
  AnnotatorSlice,
  selectAnnotationID,
  selectAnnotations,
  UpdateAnnotation
} from "../slice.ts";
import { useAnnotatorQuery } from "./query.hook";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useCurrentUser } from "@/features/auth/api";

export const useAnnotatorAnnotations = () => {
  const { data } = useAnnotatorQuery()
  const { phaseType, phase } = useRetrieveCurrentPhase()
  const { user } = useCurrentUser();
  const annotations = useAppSelector(selectAnnotations);
  const annotationID = useAppSelector(selectAnnotationID);
  const annotation = useMemo(() => {
    return annotations.find(a => a?.pk === annotationID)
  }, [ annotations, annotationID ]);
  const { confidenceLabel } = useAppSelector(state => state.AnnotatorSlice.input);
  const dispatch = useAppDispatch();

  const equals = useCallback((
    a: Pick<Annotation, 'label' | 'confidence' | 'type' | 'startFrequency' | 'startTime' | 'endTime' | 'endFrequency'>,
    b: Pick<Annotation, 'label' | 'confidence' | 'type' | 'startFrequency' | 'startTime' | 'endTime' | 'endFrequency'>
  ) => {
    return a.label.name === b.label.name
      && a.confidence?.label === b.confidence?.label
      && a.type === b.type
      && a.startTime === b.startTime
      && a.endTime === b.endTime
      && a.startFrequency === b.startFrequency
      && a.endFrequency === b.endFrequency
  }, [])

  const updateValidations = useCallback((isValid: boolean, validations?: {
    results: Array<Pick<AnnotationValidationNode, 'pk' | 'isValid'> | null>
  } | null): {
    results: Array<Pick<AnnotationValidationNode, 'pk' | 'isValid'>>
  } => {
    let results = (validations?.results ?? []).filter(r => r !== null);
    if (results.length > 0) {
      results = results.map(v => ({ ...v, isValid }))
    } else {
      results.push({
        pk: (Math.min(0, ...annotations.flatMap(a => (a.validations?.results ?? []).filter(v => v !== null).map(v => +v.pk))) - 1)?.toString(),
        isValid
      })
    }
    return { results }
  }, [ annotations ])

  const blur = useCallback(() => {
    const confidences = data?.annotationCampaignConfidenceSet?.confidenceIndicators?.results ?? []
    dispatch(AnnotatorSlice.actions.setInput({
      annotationID: undefined,
      labelName: undefined,
      confidenceLabel: (confidences.find(c => c?.isDefault) ?? confidences.find(c => c !== null))?.label ?? undefined
    }));
  }, [])

  const getAnnotationUpdate = useCallback(({ pk }: Pick<AnnotationNode, 'pk'>) => {
    return annotations.find(a => a.isUpdateOfId === pk)
  }, [ annotations ])
  const correctedAnnotation = useMemo(() => annotationID ? getAnnotationUpdate({ pk: annotationID }) : undefined, [ annotations, annotationID, getAnnotationUpdate ])

  const focus = useCallback(({ pk, label, confidence }: Pick<Annotation, 'pk' | 'label' | 'confidence'>) => {
    dispatch(AnnotatorSlice.actions.setInput({
      annotationID: pk,
      labelName: label.name,
      confidenceLabel: confidence?.label
    }));
  }, [])

  const validate = useCallback((annotation: Pick<AnnotationNode, 'pk' | 'type'> & {
    label: Pick<AnnotationLabelNode, 'name'>;
    confidence?: Pick<ConfidenceNode, 'label'> | null;
    validations?: {
      results: Array<Pick<AnnotationValidationNode, 'pk' | 'isValid'> | null>
    } | null
  }) => {
    dispatch(AnnotatorSlice.actions.assignAnnotation({
      pk: annotation.pk,
      partialUpdate: { validations: updateValidations(true, annotation.validations) }
    }));
    if (annotation.type === AnnotationType.Weak) {
      const strongAnnotations = annotations.filter(a => a.type !== AnnotationType.Weak && a.label.name === annotation.label.name);
      for (const a of strongAnnotations) {
        dispatch(AnnotatorSlice.actions.assignAnnotation({
          pk: a.pk,
          partialUpdate: { validations: updateValidations(true, a.validations) }
        }));
      }
    }
    focus(annotation)
  }, [ focus, annotations ])

  const invalidate = useCallback((annotation: Pick<AnnotationNode, 'pk' | 'type'> & {
    label: Pick<AnnotationLabelNode, 'name'>;
    confidence?: Pick<ConfidenceNode, 'label'> | null;
    validations?: {
      results: Array<Pick<AnnotationValidationNode, 'pk' | 'isValid'> | null>
    } | null
  }) => {
    dispatch(AnnotatorSlice.actions.assignAnnotation({
      pk: annotation.pk,
      partialUpdate: { validations: updateValidations(false, annotation.validations) }
    }));
    const otherStrongValidAnnotations = annotations.filter(a => {
      if (a.type === AnnotationType.Weak) return false;
      if (a.label.name !== annotation.label.name) return false;
      const v = a.validations?.results.filter(v => v !== null) ?? []
      return v.length === 0 || v.pop()?.isValid
    });
    const weakAnnotation = annotations.find(a => a.type === AnnotationType.Weak && a.label.name === annotation.label.name);
    if (annotation.type !== AnnotationType.Weak && otherStrongValidAnnotations.length === 0 && weakAnnotation) {
      dispatch(AnnotatorSlice.actions.assignAnnotation({
        pk: weakAnnotation.pk,
        partialUpdate: { validations: updateValidations(false, weakAnnotation.validations) }
      }));
    }
    focus(annotation)
  }, [ focus, annotations ])

  const add = useCallback((annotation: Omit<AddAnnotation, 'pk' | 'annotationPhase'>) => {
    if (!phase) return;
    const newAnnotation: AddAnnotation = {
      ...annotation,
      annotationPhase: {
        pk: phase.id.toString()
      },
      pk: (Math.min(0, ...annotations.map(a => +a.pk)) - 1).toString()
    }
    dispatch(AnnotatorSlice.actions.addAnnotation(newAnnotation))
    focus(newAnnotation)
  }, [ annotations, focus, phase ])

  const remove = useCallback((annotation: Annotation) => {
    if (phaseType === "Annotation" || annotation.annotator?.pk === user?.pk) {
      dispatch(AnnotatorSlice.actions.removeAnnotation(annotation))
      const weak = annotations.find(a => a.type === AnnotationType.Weak && a.label.name === annotation.label.name && a.pk !== annotation.pk);
      if (weak) focus(weak)
      else blur()
    } else {
      invalidate(annotation)
    }
  }, [ phaseType, annotations, focus, blur, invalidate ])

  const update = useCallback((
    annotation: Annotation,
    partialUpdate: UpdateAnnotation
  ) => {
    if (annotation.type === AnnotationType.Weak) return;
    if (phaseType === "Annotation" || annotation.annotator?.pk === user?.pk) {
      dispatch(AnnotatorSlice.actions.assignAnnotation({ pk: annotation.pk, partialUpdate }))
      if (partialUpdate.label?.name && !annotations.find(a => a.label.name === partialUpdate.label!.name && a.type === AnnotationType.Weak)) {
        add({
          type: AnnotationType.Weak,
          label: partialUpdate.label,
          confidence: partialUpdate.confidence ?? confidenceLabel ? { label: confidenceLabel! } : undefined,
        })
      }
    } else {
      const initialUpdateAnnotation = getAnnotationUpdate(annotation)
      const updateAnnotation: Omit<AddAnnotation, 'id'> = {
        ...annotation, // Base is initial annotation
        ...(initialUpdateAnnotation ?? { id: undefined }), // Add existing update info if exist
        ...partialUpdate, // Update according provided info
      }
      if (equals(annotation, updateAnnotation)) {
        if (initialUpdateAnnotation) remove(initialUpdateAnnotation)
        validate(annotation)
      } else {
        if (initialUpdateAnnotation) {
          dispatch(AnnotatorSlice.actions.assignAnnotation({ pk: initialUpdateAnnotation.pk, partialUpdate }))
        } else {
          add(updateAnnotation)
        }
        invalidate(annotation)
      }
    }
    focus({ ...annotation, ...partialUpdate })
  }, [ phaseType, annotations, add, focus, getAnnotationUpdate, equals, remove, validate, invalidate, user ])

  const updateFeatures = useCallback((
    annotation: Annotation,
    partialUpdate: Partial<Annotation['acousticFeatures']>
  ) => {
    if (annotation.type === AnnotationType.Weak) return;
    dispatch(AnnotatorSlice.actions.assignAnnotation({
      pk: annotation.pk, partialUpdate: {
        acousticFeatures: {
          ...(annotation.acousticFeatures ?? {}),
          ...partialUpdate
        }
      }
    }))
  }, [ update, annotations ])
  const removeFeatures = useCallback((annotation: Annotation) => {
    if (annotation.type === AnnotationType.Weak) return;
    dispatch(AnnotatorSlice.actions.assignAnnotation({
      pk: annotation.pk,
      partialUpdate: { acousticFeatures: undefined }
    }))
  }, [ update ])

  return {
    annotationID,
    annotation,
    correctedAnnotation,
    annotations,
    focus, blur,
    add, update, remove,
    validate, invalidate,
    getAnnotationUpdate,
    updateFeatures, removeFeatures
  }
}