import { DatasetFile } from './data';
import { ID } from '@/service/type';

export type AnnotationCampaignUsage = 'Create' | 'Check';
export type Phase = 'Annotation' | 'Verification';

export type AnnotationPhase = {
  id: number;
  phase: Phase;
  /** Date */
  created_at: string;
  /** Display name */
  created_by: string;
  /** Date */
  ended_at: string;
  /** Display name */
  ended_by: string;
  global_progress: number;
  global_total: number;
  user_progress: number;
  user_total: number;
  has_annotations: boolean;
  annotation_campaign: number; // pk
}


export interface LabelSet {
  id: number;
  name: string;
  desc?: string;
  labels: Array<string>;
}

export interface ConfidenceIndicator {
  id: number;
  label: string;
  level: number;
  is_default: boolean;
}

export interface ConfidenceIndicatorSet {
  id: number;
  name: string;
  desc: string;
  confidence_indicators: Array<ConfidenceIndicator>
}

export interface AnnotationFileRange {
  id: number;
  first_file_index: number;
  last_file_index: number;
  files_count: number; // read only
  annotator: ID; // pk
  annotation_campaign_phase: number; // pk - read only

  finished_tasks_count: number; // read only
}

export type AnnotationFile = DatasetFile & {
  is_submitted: boolean; // read only
  results_count: number; // read only
  validated_results_count: number; // read only
}

