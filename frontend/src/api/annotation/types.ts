export type ImportAnnotation = {

  /** Date.getTime() */
  start_datetime?: number;
  /** Date.getTime() */
  end_datetime?: number;
  /** [0 ; samplingFrequency/2] */
  start_frequency?: number;
  /** [0 ; samplingFrequency/2] */
  end_frequency?: number;

  /** SpectrogramAnalysisNode.id */
  analysis: string | number;

  label__name: string
  confidence__label?: string
  confidence__level?: number
  detector__name: string
  detector_configuration__configuration: string
}
