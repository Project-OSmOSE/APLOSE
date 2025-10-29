import {
  type AcousticFeaturesNode,
  AnnotationAcousticFeaturesSerializerInput,
  type AnnotationCommentNode,
  AnnotationInput,
  type AnnotationLabelNode,
  type AnnotationNode,
  type AnnotationValidationNode,
  AnnotationValidationSerializerInput,
  type ConfidenceNode,
  type DetectorNode,
  type Maybe,
  type SpectrogramAnalysisNode,
  type UserNode,
  useUpdateAnnotations,
} from '@/api';
import { useCallback, useEffect, useRef } from 'react';
import { useAnnotatorAnnotation } from './hooks';
import { type Annotation, type Features, type Validation } from './slice';
import { convertCommentsToPost, convertGqlToComments } from '@/features/Annotator/Comment';

export function convertValidationToPost(validation: Validation): AnnotationValidationSerializerInput {
  return {
    ...validation,
    id: validation.id > 0 ? validation.id : undefined,
  }
}

export function convertGqlToValidation(validations: Maybe<Pick<AnnotationValidationNode, 'id' | 'isValid'>>[]): Validation | undefined {
  validations = validations.filter(v => !!v)
  if (validations.length === 0) return undefined
  const v = validations[0]
  return {
    id: +v!.id,
    isValid: v!.isValid,
  }
}

export function convertFeaturesToPost(features: Features): AnnotationAcousticFeaturesSerializerInput {
  return {
    ...features,
    id: features.id > 0 ? features.id : undefined,
  }
}

export function convertGqlToFeatures(features: Omit<AcousticFeaturesNode, '__typename'>): Features {
  return {
    ...features,
    id: +features.id,
  }
}

export function convertAnnotationsToPost(annotations: Annotation[]): AnnotationInput[] {
  return [ ...annotations, ...annotations.filter(a => a.update).map(a => ({
    ...a.update,
    is_update_of: a.id,
  } as Annotation)) ].map(a => ({
    ...a,
    id: a.id > 0 ? a.id : undefined,
    comments: convertCommentsToPost(a.comments ?? []),
    validations: [ a.validation ? convertValidationToPost(a.validation) : null ],
    acousticFeatures: a.acousticFeatures ? convertFeaturesToPost(a.acousticFeatures) : undefined,
  } as AnnotationInput))
}

type Node =
    Pick<AnnotationNode, 'id' | 'type' | 'startFrequency' | 'endFrequency' | 'startTime' | 'endTime'>
    & {
  isUpdateOf?: Maybe<Pick<AnnotationNode, 'id'>>,
  annotator?: Maybe<Pick<UserNode, 'id'>>,
  detectorConfiguration?: Maybe<{
    detector: Pick<DetectorNode, 'id'>
  }>,
  confidence?: Maybe<Pick<ConfidenceNode, 'label'>>,
  acousticFeatures?: Maybe<AcousticFeaturesNode>,
  comments?: Maybe<{
    results: Maybe<Pick<AnnotationCommentNode, 'id' | 'comment'>>[],
  }>,
  validations?: Maybe<{
    results: Maybe<Pick<AnnotationValidationNode, 'id' | 'isValid'>>[],
  }>,
  label: Pick<AnnotationLabelNode, 'name'>,
  analysis: Pick<SpectrogramAnalysisNode, 'id'>,
}

export function convertGqlToAnnotation(annotation: Node): Annotation {
  return {
    id: +annotation.id,
    update: undefined,
    label: annotation.label.name,
    comments: convertGqlToComments(annotation.comments?.results ?? []),
    validation: convertGqlToValidation(annotation.validations?.results ?? []),
    type: annotation.type,
    annotator: annotation.annotator?.id,
    acoustic_features: annotation.acousticFeatures ? convertGqlToFeatures(annotation.acousticFeatures) : undefined,
    end_frequency: annotation.endFrequency === null ? undefined : annotation.endFrequency,
    start_frequency: annotation.startFrequency === null ? undefined : annotation.startFrequency,
    end_time: annotation.endTime === null ? undefined : annotation.endTime,
    start_time: annotation.startTime === null ? undefined : annotation.startTime,
    confidence: annotation.confidence?.label,
    detector_configuration: annotation.detectorConfiguration?.detector.id,
    analysis: annotation.analysis.id,
  } as Annotation
}

export function convertGqlToAnnotations(annotations: Node[]): Annotation[] {
  return annotations.filter(a => !a.isUpdateOf).map(a => {
    const update = annotations.find(a => a.isUpdateOf?.id === a.id);
    return {
      ...convertGqlToAnnotation(a),
      update: update ? convertGqlToAnnotation(update) : undefined,
    }
  })
}

export const useAnnotatorAnnotationPost = () => {
  const { updateAnnotations, ...info } = useUpdateAnnotations()
  const { allAnnotations } = useAnnotatorAnnotation()

  const allAnnotationsRef = useRef<Annotation[]>(allAnnotations)
  useEffect(() => {
    allAnnotationsRef.current = allAnnotations
  }, [ allAnnotations ]);

  const post = useCallback(async () => {
    await updateAnnotations(convertAnnotationsToPost(allAnnotationsRef.current))
  }, [ updateAnnotations ])

  return {
    allAnnotationsRef,
    postAnnotations: post,
    ...info,
  }
}