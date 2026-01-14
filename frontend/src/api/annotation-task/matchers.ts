import { AnnotationTaskGqlAPI, } from "./api";

const {
  getAnnotationTask,
} = AnnotationTaskGqlAPI.endpoints

export const getAnnotationTaskFulfilled = getAnnotationTask.matchFulfilled
