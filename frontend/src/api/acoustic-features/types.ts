import { SignalTrendType } from "@/api";

export type PostAcousticFeatures = {
  id?: string | number;

  /** [0 ; samplingFrequency/2] */
  start_frequency?: number;
  /** [0 ; samplingFrequency/2] */
  end_frequency?: number;

  relative_min_frequency_count?: number;
  relative_max_frequency_count?: number;

  has_harmonics?: boolean;

  trend?: SignalTrendType;

  steps_count?: number;
}