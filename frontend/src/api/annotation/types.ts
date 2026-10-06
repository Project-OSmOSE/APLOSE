export type ImportAnnotation = {

  /** ISO formatted date */
  start_datetime?: string;
  /** ISO formatted date */
  end_datetime?: string;
  /** [0 ; samplingFrequency/2] */
  min_frequency?: number;
  /** [0 ; samplingFrequency/2] */
  max_frequency?: number;

  label: string
  confidence_indicator_label?: string
  confidence_indicator_level?: number
  detector: string
  detector_configuration: string
}
