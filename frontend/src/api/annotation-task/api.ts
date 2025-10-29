import { api } from './annotation-task.generated'
import { restAPI } from '@/api/baseRestApi';
import { AnnotationCommentInput, AnnotationInput, AnnotationPhaseType } from '@/api';

export const AnnotationTaskGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listAnnotationTask: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'AnnotationTask',
        id: JSON.stringify(args),
      } ],
    },
    getAnnotationTask: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'AnnotationTask',
        id: JSON.stringify(args),
      } ],
    },
  },
})

export const AnnotationTaskRestAPI = restAPI.injectEndpoints({
  endpoints: builder => ({
    submitTask: builder.mutation<void, {
      campaignID: string | number;
      phaseType: AnnotationPhaseType;
      spectrogramID: string | number;
      annotations: AnnotationInput[],
      taskComments: AnnotationCommentInput[],
      start: Date
    }>({
      query: ({ campaignID, phaseType, spectrogramID, annotations, taskComments, start }) => ({
        url: `annotation-task/campaign/${ campaignID }/phase/${ phaseType }/spectrogram/${ spectrogramID }/`,
        method: 'POST',
        body: {
          start: start.toISOString(),
          end: new Date().toISOString(),
          session_output: JSON.stringify({ annotations, taskComments }),
        },
      }),
    }),
  }),
})
