import { restAPI } from '@/api/baseRestApi';
import { AnnotationPhaseType, type PostAnnotationComment } from '@/api';

export const AnnotationCommentRestAPI = restAPI.injectEndpoints({
  endpoints: builder => ({
    updateTaskComments: builder.mutation<void, {
      campaignID: string | number;
      phaseType: AnnotationPhaseType;
      spectrogramID: string | number;
      comments: PostAnnotationComment[]
    }>({
      query: ({ campaignID, phaseType, spectrogramID, comments }) => ({
        url: `annotation-task/campaign/${ campaignID }/phase/${ phaseType }/spectrogram/${ spectrogramID }/`,
        method: 'POST',
        body: comments,
      }),
    }),
  }),
})
