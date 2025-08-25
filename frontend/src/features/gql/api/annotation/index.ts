export {
  api as AnnotationAPI
} from './annotation.generated'
export {
  api as AnnotationFileRangeAPI
} from './annotationFileRange.generated'
export {
  api as AnnotationPhaseAPI
} from './annotationPhase.generated'

export enum TaskStatus {
  created = "Created",
  finished = "Finished",
}

export enum PhaseType {
  annotation = "Annotation",
  verification = "Verification",
}
