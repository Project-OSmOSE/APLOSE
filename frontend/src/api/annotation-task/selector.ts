import { type AppState } from '@/features/App';
import { AnnotationTaskGqlAPI } from './api'
import { GetAnnotationTaskQueryVariables } from './annotation-task.generated'

export const selectTask = (state: AppState, variables: GetAnnotationTaskQueryVariables) =>
  AnnotationTaskGqlAPI.endpoints.getAnnotationTask.select(variables)(state)
