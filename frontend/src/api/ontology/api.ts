import { api } from "./ontology.generated";

export const OntologyGqlAPI = api.enhanceEndpoints({
  endpoints: {
    getAllSounds: {
      providesTags: [ 'Sound' ]
    },
    getDetailedSoundByID: {
      providesTags: result => result?.soundById ? [ { type: 'Sound' as const, id: result.soundById.id } ] : []
    },
    updateSound: {
      invalidatesTags: result => result?.postSound?.sound?.id ? [ {
        type: 'Sound',
        id: result.postSound.sound.id
      }, 'Sound' ] : [ 'Sound' ]
    },
    createSound: {
      invalidatesTags: [ 'Sound' ]
    },
    deleteSound: {
      invalidatesTags: (_1, _2, { id }) => [ { type: 'Sound' as const, id }, 'Sound' ]
    },
    getAllSources: {
      providesTags: [ 'Source' ]
    },
    getDetailedSourceByID: {
      providesTags: result => result?.sourceById ? [ { type: 'Sound' as const, id: result.sourceById.id } ] : []
    },
    updateSource: {
      invalidatesTags: result => result?.postSource?.source?.id ? [ {
        type: 'Source',
        id: result.postSource.source.id
      }, 'Source' ] : [ 'Source' ],
    },
    createSource: {
      invalidatesTags: [ 'Source' ],
    },
    deleteSource: {
      invalidatesTags: (_1, _2, { id }) => [ { type: 'Source' as const, id }, 'Source' ]
    }
  }
})