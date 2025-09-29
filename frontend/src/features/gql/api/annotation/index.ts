export {
  api as AnnotationAPI
} from './annotation.generated'

export enum TaskStatus {
  created = "Created",
  finished = "Finished",
}

export enum PhaseType {
  annotation = "Annotation",
  verification = "Verification",
}
