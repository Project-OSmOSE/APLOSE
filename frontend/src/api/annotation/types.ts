import { AnnotationCommentInput, PostAcousticFeatures, PostAnnotationValidation } from '@/api';

export type PostAnnotation = {
  id?: number;

  /** [0 ; duration] */
  start_time?: number;
  /** [0 ; duration] */
  end_time?: number;
  /** [0 ; samplingFrequency/2] */
  start_frequency?: number;
  /** [0 ; samplingFrequency/2] */
  end_frequency?: number;

  /** AnnotationLabelNode.name */
  label: string;
  /** ConfidenceNode.label */
  confidence?: string;

  /** SpectrogramAnalysisNode.id */
  analysis: string | number;

  /** DetectorConfigurationNode.id */
  detector_configuration?: string | number;

  /** AnnotationNode.id */
  is_update_of?: string | number;

  acoustic_features?: PostAcousticFeatures;
  comments?: AnnotationCommentInput[];
  validation?: PostAnnotationValidation;
}

export type ImportAnnotation =
    Pick<
        PostAnnotation,
        'start_time'
        | 'end_time'
        | 'start_frequency'
        | 'end_frequency'
        | 'analysis'
    > & {
  label__name: string
  confidence__label?: string
  confidence__level?: number
  detector__name: string
  detector_configuration__configuration: string
}