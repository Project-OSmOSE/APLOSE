import { createApi } from '@reduxjs/toolkit/query/react';
import { GraphQLClient } from 'graphql-request';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import { prepareHeaders } from './utils';


export const client = new GraphQLClient(`/api/graphql`)

function prepareGqlHeaders(headers: Headers) {
  headers = prepareHeaders(headers);

  // Set "Accept" header
  headers.set('Accept', 'application/json, multipart/mixed')

  return headers
}

export const GqlTags =  [
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
  ]

export const gqlAPI = createApi({
  tagTypes: GqlTags,
  reducerPath: 'gql',
  baseQuery: async (args, api, extraOptions) => {
    const result: any = await graphqlRequestBaseQuery({
      client,
      prepareHeaders: prepareGqlHeaders,
    })(args, api, extraOptions)
    if (!('error' in result) && 'data' in result && 'errors' in result.data) {
      result.error = result.data.errors
    }
    return result
  },
  endpoints: () => ({}),
})