import {
  type AcousticFeatures,
  AnnotationComment,
  type AnnotationResultValidations,
  DatasetFile,
  DetectorConfiguration,
} from '../../src/service/types';
import { CAMPAIGN, CAMPAIGN_PHASE, CONFIDENCE, DETECTOR, FILE_RANGE, LABEL } from './campaign';
import { USERS } from './user';

interface BaseAnnotationResult {
  id: number;
  label: string;
  confidence_indicator: string | null;
  annotation_campaign_phase: number; // pk - read only
  annotator: number | null; // pk - read only
  dataset_file: number; // pk - read only
  detector_configuration: DetectorConfiguration & { detector: string } | null;
  comments: Array<AnnotationComment>;
  validations: Array<AnnotationResultValidations>;
  acoustic_features: AcousticFeatures | null;
  updated_to: AnnotationResult[];
}

type WeakBounds = {
  type: 'Weak',
  start_time: null;
  end_time: null;
  start_frequency: null;
  end_frequency: null;
}
type PointBounds = {
  type: 'Point',
  start_time: number;
  end_time: null;
  start_frequency: number;
  end_frequency: null;
}
type BoxBounds = {
  type: 'Box',
  start_time: number;
  end_time: number;
  start_frequency: number;
  end_frequency: number;
}
type AnnotationResultBounds = WeakBounds | PointBounds | BoxBounds

type AnnotationResult = BaseAnnotationResult & AnnotationResultBounds
type WeakResult = BaseAnnotationResult & WeakBounds
type BoxResult = BaseAnnotationResult & BoxBounds

type AnnotatorData = {
  file: DatasetFile;
  is_submitted: boolean;
  is_assigned: boolean; // Is the user allowed to edit this file
  task_comments: Array<AnnotationComment>;
  results: Array<AnnotationResult>;


  previous_file_id: number | null;
  next_file_id: number | null;

  current_task_index: number;
  total_tasks: number;
  current_task_index_in_filter: number;
  total_tasks_in_filter: number;


  campaignID: number;
  userID: number
}

export const COMMENT = {
  task: {
    id: 1,
    comment: 'A task comment',
    annotation_campaign: CAMPAIGN.id,
    annotation_result: null,
    author: USERS.annotator.id,
    dataset_file: FILE_RANGE.unsubmittedFile.id,
  } as AnnotationComment,
  presence: {
    id: 2,
    comment: 'A presence comment',
    annotation_campaign: CAMPAIGN.id,
    annotation_result: 1, // RESULTS.presence.id
    author: USERS.annotator.id,
    dataset_file: FILE_RANGE.unsubmittedFile.id,
  } as AnnotationComment,
}
export const RESULTS: { presence: WeakResult, box: BoxResult } = {
  presence: {
    id: 1,
    label: LABEL.classic,
    type: 'Weak',
    start_time: null,
    end_time: null,
    start_frequency: null,
    end_frequency: null,
    acoustic_features: null,
    annotation_campaign_phase: CAMPAIGN_PHASE.id,
    dataset_file: FILE_RANGE.unsubmittedFile.id,
    comments: [ COMMENT.presence ],
    confidence_indicator: CONFIDENCE.sure.label,
    annotator: USERS.annotator.id,
    validations: [],
    detector_configuration: null,
    updated_to: [],
  },
  box: {
    id: 2,
    label: LABEL.classic,
    type: 'Box',
    start_time: 5,
    end_time: 10,
    start_frequency: 12,
    end_frequency: 40,
    acoustic_features: null,
    annotation_campaign_phase: CAMPAIGN_PHASE.id,
    dataset_file: FILE_RANGE.unsubmittedFile.id,
    comments: [],
    confidence_indicator: CONFIDENCE.notSure.label,
    annotator: USERS.annotator.id,
    validations: [],
    detector_configuration: null,
    updated_to: [],
  },
}
export const CREATE_DATA: (empty?: boolean) => AnnotatorData = empty => ({
  is_submitted: false,
  is_assigned: true,
  task_comments: empty ? [] : [ COMMENT.task ],
  campaignID: CAMPAIGN.id,
  results: empty ? [] : [ RESULTS.presence, RESULTS.box ],
  file: FILE_RANGE.unsubmittedFile,
  current_task_index: 2,
  current_task_index_in_filter: 2,
  previous_file_id: FILE_RANGE.submittedFile.id,
  next_file_id: null,
  userID: USERS.annotator.id,
  total_tasks: FILE_RANGE.range.files_count,
  total_tasks_in_filter: FILE_RANGE.range.files_count,
})
export const CHECK_DATA: (empty?: boolean) => AnnotatorData = empty => ({
  is_submitted: false,
  is_assigned: true,
  task_comments: empty ? [] : [ COMMENT.task ],
  campaignID: CAMPAIGN.id,
  results: empty ? [] : [ {
    ...RESULTS.presence,
    annotator: null,
    detector_configuration: { ...DETECTOR.configurations[0], detector: DETECTOR.name },
  }, {
    ...RESULTS.box,
    annotator: null,
    detector_configuration: { ...DETECTOR.configurations[0], detector: DETECTOR.name },
  } ],
  file: FILE_RANGE.unsubmittedFile,
  current_task_index: 2,
  current_task_index_in_filter: 2,
  previous_file_id: FILE_RANGE.submittedFile.id,
  next_file_id: null,
  userID: USERS.annotator.id,
  total_tasks: FILE_RANGE.range.files_count,
  total_tasks_in_filter: FILE_RANGE.range.files_count,
})