import { api } from './annotator.generated.ts'

const enhancedAPI = api.enhanceEndpoints({
  addTagTypes: [ 'Annotator', 'SpectrogramPath' ],
  endpoints: {
    getAnnotator: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'Annotator',
        id: JSON.stringify(args)
      } ]
    },
    getSpectrogramPath: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ {
        type: 'SpectrogramPath',
        id: JSON.stringify(args)
      } ]
    }
  }
})

export {
  enhancedAPI as AnnotatorAPI,
}