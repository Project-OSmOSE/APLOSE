import { restAPI } from '@/api/baseRestApi';
import { getDownloadResponseHandler } from '@/service/function';
import type { SpectrogramAnalysisNode } from '@/api';


export const DownloadRestAPI = restAPI.injectEndpoints({
  endpoints: builder => ({
    downloadAnalysis: builder.mutation<void, Pick<SpectrogramAnalysisNode, 'id' | 'name'>>({
      query: ({ id, name }) => {
        return {
          url: `/download/analysis-export/${ id }/`,
          responseHandler: getDownloadResponseHandler(`${ name }.zip`),
        }
      },
    }),
  }),
})
