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

export const gqlAPI = createApi({
  tagTypes: [
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
  ],
  reducerPath: 'gql',
  baseQuery: graphqlRequestBaseQuery({
    client,
    prepareHeaders: prepareGqlHeaders,
  }),
  endpoints: () => ({}),
})