import { createApi } from '@reduxjs/toolkit/query/react';
import { ClientError, GraphQLClient } from 'graphql-request';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { prepareHeaders } from './utils';


export const client = new GraphQLClient(`/api/graphql`)

function prepareGqlHeaders(headers: Headers) {
    headers = prepareHeaders(headers);

    // Set "Accept" header
    headers.set('Accept', 'application/json, multipart/mixed')

    return headers
}

export const GqlTags = [
    // Annotation Campaign
    'Campaign',

    // Annotation File Range
    'AnnotationFileRange',

    // Annotation Phase
    'AnnotationPhase',

    // Annotation Task
    'AnnotationTask',

    // Channel Configuration
    'ChannelConfiguration',

    // Confidence Set
    'ConfidenceSet',

    // Dataset
    'Dataset', 'DetailedDataset', 'ImportDataset', 'DatasetsAndAnalysis',

    // Detector
    'Detector',

    // Label Set
    'LabelSet', 'CampaignLabels',

    // Ontology
    'Source', 'Sound',

    // Spectrogram Analysis
    'SpectrogramAnalysis', 'ImportSpectrogramAnalysis',

    // User
    'CurrentUser', 'User',

    // Collaborator
    'Collaborator',

    // Storage
    'Folders',
]

export type GqlError = {
    status: number;
    statusErrorMessage: string;
    messages?: string[];
    original?: any[];
}

export const gqlAPI = createApi({
    tagTypes: GqlTags,
    reducerPath: 'gql',
    baseQuery: async (args, api, extraOptions) => {
        const result: any = await graphqlRequestBaseQuery({
            client,
            prepareHeaders: prepareGqlHeaders,
            customErrors: ({ response }: ClientError) => {
                let statusErrorMessage = `GraphQL Error (Code: ${response.status})`
                switch (response.status) {
                    case 500:
                        statusErrorMessage = 'Internal Server Error';
                        break;
                }
                return {
                    status: response.status,
                    statusErrorMessage,
                    messages: response.errors?.map(e => e.message),
                    original: response.errors
                }
            }
        })(args, api, extraOptions)
        return { ...result, error: result.data?.errors ?? result.error }
    },
    endpoints: () => ({}),
})