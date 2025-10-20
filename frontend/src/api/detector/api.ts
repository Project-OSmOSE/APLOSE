import { api } from './detector.generated'

export const DetectorGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listDetectors: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'Detector',
        id: args ? JSON.stringify(args) : undefined,
      } ],
    },
  },
})
