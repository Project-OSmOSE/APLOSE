import { api } from "./display-acquisition.generated.ts";

const Tags = [ 'ChannelConfiguration' ]

export const AcquisitionDisplayAPI = api.enhanceEndpoints<typeof Tags[number]>({
  addTagTypes: Tags,
  endpoints: {
    getChannelConfigurations: {
      // @ts-expect-error: result and error are unused
      providesTags: (result, error, args) => [ { type: 'ChannelConfiguration', id: JSON.stringify(args) } ]
    },
  }
})