import { api } from './channel-configuration.generated'

export const ChannelConfigurationGqlAPI = api.enhanceEndpoints({
  endpoints: {
    listChannelConfigurations: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ { type: 'ChannelConfiguration', id: JSON.stringify(args) } ]
    },
  }
})