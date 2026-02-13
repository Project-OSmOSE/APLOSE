import { restAPI } from '../baseRestApi';
import type { FetchArgs } from '@reduxjs/toolkit/query';


export const SpectrogramRestAPI = restAPI.injectEndpoints({
    endpoints: (builder) => ({
        getTile: builder.query<string, FetchArgs>({
            query: (args) => ({
                ...args,
                responseHandler: async (response: Response) => {
                    console.debug('responseHandler', response);
                    if (response.status !== 200) throw new Error(response.statusText)
                    const blob = await response.blob()
                    return URL.createObjectURL(blob)
                }
            }),
            providesTags: (_result, _error, arg) => [{type: 'Tile', id: JSON.stringify(arg)}]
        }),
    }),
})
