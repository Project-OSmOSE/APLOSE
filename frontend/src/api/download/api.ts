import { restAPI } from '@/api/baseRestApi';
import { getDownloadResponseHandler } from '@/service/function';
import type { SpectrogramAnalysisNode } from '@/api';


export const DownloadRestAPI = restAPI.injectEndpoints({
  endpoints: builder => ({

    downloadAnalysis: builder.mutation<void, Pick<SpectrogramAnalysisNode, 'id' | 'name'>>({
      query: ({ id, name }) => {
        return {
          url: `/api/download/analysis-export/${ id }/`,
          responseHandler: getDownloadResponseHandler(`${ name }.zip`),
        }
      },
    }),

    downloadAnnotations: builder.mutation<void, { phaseID: string, campaignName: string }>({
      query: ({ phaseID, campaignName }) => {
        return {
          url: `/api/download/phase-annotations/${ phaseID }/`,
          responseHandler: getDownloadResponseHandler(`${ campaignName.replaceAll(' ', '_') }_results.csv`),
        }
      },
    }),

    downloadProgress: builder.mutation<void, { phaseID: string, campaignName: string }>({
      query: ({ phaseID, campaignName }) => {
        return {
          url: `/api/download/phase-progression/${ phaseID }/`,
          responseHandler: getDownloadResponseHandler(`${ campaignName.replaceAll(' ', '_') }_status.csv`),
        }
      },
    }),

  }),
})
