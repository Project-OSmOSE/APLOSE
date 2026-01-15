import {
  type AcousticFeaturesNode,
  AnnotationAcousticFeaturesSerializerInput,
  type AnnotationCommentNode,
  AnnotationInput,
  type AnnotationLabelNode,
  type AnnotationNode,
  type AnnotationPhaseNode,
  AnnotationPhaseType,
  type AnnotationValidationNode,
  AnnotationValidationSerializerInput,
  type ConfidenceNode,
  type DetectorConfigurationNode,
  type DetectorNode,
  type Maybe,
  type SpectrogramAnalysisNode,
  type UserNode,
} from '@/api';
import { type Annotation, type Features, type Validation } from './slice';
import { convertCommentsToPost, convertGqlToComments } from '@/features/Annotator/Comment/conversions';

export function convertValidationToPost(validation: Validation): AnnotationValidationSerializerInput {
  return {
    ...validation,
    id: validation.id && validation.id > 0 ? validation.id : undefined,
  }
}

export function convertGqlToValidation(validations: Maybe<Pick<AnnotationValidationNode, 'id' | 'isValid'>>[],
                                       phase: AnnotationPhaseType,
                                       annotationIsFromCurrentAnnotator: boolean): Validation | undefined {
  validations = validations.filter(v => !!v)
  if (validations.length === 0) {
    if (phase === AnnotationPhaseType.Verification && !annotationIsFromCurrentAnnotator) return { isValid: true }
    else return undefined
  }
  const v = validations[0]
  return {
    id: +v!.id,
    isValid: v!.isValid,
  }
}

export function convertFeaturesToPost(features: Features): AnnotationAcousticFeaturesSerializerInput {
  return {
    ...features,
    id: features.id && features.id > 0 ? features.id : undefined,
  }
}

export function convertGqlToFeatures(features: Omit<AcousticFeaturesNode, '__typename'>): Features {
  return {
    ...features,
    id: +features.id,
  } as Features
}

export function convertAnnotationsToPost(annotations: Annotation[]): AnnotationInput[] {
  console.log(annotations)
  return [ ...annotations, ...annotations.filter(a => a.update).map(a => ({
    ...a.update,
    isUpdateOf: a.id?.toString(),
  } as Annotation)) ].map(a => ({
    ...a,
    type: undefined,
    id: a.id > 0 ? a.id : undefined,
    comments: convertCommentsToPost(a.comments ?? []),
    validation: undefined,
    update: undefined,
    validations: a.validation ? [ convertValidationToPost(a.validation) ] : undefined,
    acousticFeatures: a.acousticFeatures ? convertFeaturesToPost(a.acousticFeatures) : undefined,
  } as AnnotationInput))
}

type Node =
  Pick<AnnotationNode, 'id' | 'type' | 'startFrequency' | 'endFrequency' | 'startTime' | 'endTime'>
  & {
  isUpdateOf?: Maybe<Pick<AnnotationNode, 'id'>>,
  annotator?: Maybe<Pick<UserNode, 'id'>>,
  detectorConfiguration?: Maybe<Pick<DetectorConfigurationNode, 'id'> &{
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
  annotationPhase: Pick<AnnotationPhaseNode, 'id'>
}

export function convertGqlToAnnotation(annotation: Node,
                                       phase: AnnotationPhaseType,
                                       userId?: string): Annotation {
  return {
    id: +annotation.id,
    annotationPhase: annotation.annotationPhase.id,
    update: undefined,
    label: annotation.label.name,
    comments: convertGqlToComments(annotation.comments?.results ?? []),
    type: annotation.type,
    annotator: annotation.annotator?.id,
    validation: convertGqlToValidation(annotation.validations?.results ?? [], phase, annotation.annotator?.id === userId),
    acousticFeatures: annotation.acousticFeatures ? convertGqlToFeatures(annotation.acousticFeatures) : undefined,
    endFrequency: annotation.endFrequency === null ? undefined : annotation.endFrequency,
    startFrequency: annotation.startFrequency === null ? undefined : annotation.startFrequency,
    endTime: annotation.endTime === null ? undefined : annotation.endTime,
    startTime: annotation.startTime === null ? undefined : annotation.startTime,
    confidence: annotation.confidence?.label,
    detectorConfiguration: annotation.detectorConfiguration?.id,
    analysis: annotation.analysis.id,
  } as Annotation
}

export function convertGqlToAnnotations(annotations: Node[],
                                        phase: AnnotationPhaseType,
                                        userId?: string): Annotation[] {
  return annotations.filter(a => !a.isUpdateOf).map(a => {
    const update = annotations.find(u => u.isUpdateOf?.id === a.id);
    return {
      ...convertGqlToAnnotation(a, phase, userId),
      update: update ? convertGqlToAnnotation(update, phase, userId) : undefined,
    }
  })
}
