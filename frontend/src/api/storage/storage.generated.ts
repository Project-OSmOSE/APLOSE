import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type BrowseStorageQueryVariables = Types.Exact<{
  path?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type BrowseStorageQuery = { __typename?: 'Query', browse?: Array<{ __typename: 'AnalysisStorageNode', name: string, path: string, importStatus: Types.Status, model?: { __typename?: 'SpectrogramAnalysisNode', annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'DatasetStorageNode', name: string, path: string, importStatus: Types.Status, model?: { __typename?: 'DatasetNode', id: string, annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'FolderNode', name: string, path: string } | null> | null };

export type SearchStorageQueryVariables = Types.Exact<{
  path: Types.Scalars['String']['input'];
}>;


export type SearchStorageQuery = { __typename?: 'Query', search?: { __typename: 'AnalysisStorageNode', name: string, path: string, importStatus: Types.Status, model?: { __typename?: 'SpectrogramAnalysisNode', annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'DatasetStorageNode', name: string, path: string, importStatus: Types.Status, model?: { __typename?: 'DatasetNode', id: string, annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'FolderNode', name: string, path: string } | null };

export type ImportDatasetFromStorageMutationVariables = Types.Exact<{
  path: Types.Scalars['String']['input'];
}>;


export type ImportDatasetFromStorageMutation = { __typename?: 'Mutation', importDataset?: { __typename?: 'ImportDatasetMutation', dataset: { __typename?: 'DatasetNode', id: string } } | null };

export type ImportAnalysisFromStorageMutationVariables = Types.Exact<{
  name: Types.Scalars['String']['input'];
  datasetPath: Types.Scalars['String']['input'];
}>;


export type ImportAnalysisFromStorageMutation = { __typename?: 'Mutation', importAnalysis?: { __typename?: 'ImportAnalysisMutation', analysis: { __typename?: 'SpectrogramAnalysisNode', id: string } } | null };


export const BrowseStorageDocument = `
    query browseStorage($path: String) {
  browse(path: $path) {
    ... on FolderNode {
      __typename
      name
      path
    }
    ... on DatasetStorageNode {
      __typename
      name
      path
      importStatus
      model {
        id
        annotationCampaigns {
          edges {
            node {
              isArchived
            }
          }
        }
      }
    }
    ... on AnalysisStorageNode {
      __typename
      name
      path
      importStatus
      model {
        annotationCampaigns {
          edges {
            node {
              isArchived
            }
          }
        }
      }
    }
  }
}
    `;
export const SearchStorageDocument = `
    query searchStorage($path: String!) {
  search(path: $path) {
    ... on FolderNode {
      __typename
      name
      path
    }
    ... on DatasetStorageNode {
      __typename
      name
      path
      importStatus
      model {
        id
        annotationCampaigns {
          edges {
            node {
              isArchived
            }
          }
        }
      }
    }
    ... on AnalysisStorageNode {
      __typename
      name
      path
      importStatus
      model {
        annotationCampaigns {
          edges {
            node {
              isArchived
            }
          }
        }
      }
    }
  }
}
    `;
export const ImportDatasetFromStorageDocument = `
    mutation importDatasetFromStorage($path: String!) {
  importDataset(path: $path) {
    dataset {
      id
    }
  }
}
    `;
export const ImportAnalysisFromStorageDocument = `
    mutation importAnalysisFromStorage($name: String!, $datasetPath: String!) {
  importAnalysis(name: $name, datasetPath: $datasetPath) {
    analysis {
      id
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    browseStorage: build.query<BrowseStorageQuery, BrowseStorageQueryVariables | void>({
      query: (variables) => ({ document: BrowseStorageDocument, variables })
    }),
    searchStorage: build.query<SearchStorageQuery, SearchStorageQueryVariables>({
      query: (variables) => ({ document: SearchStorageDocument, variables })
    }),
    importDatasetFromStorage: build.mutation<ImportDatasetFromStorageMutation, ImportDatasetFromStorageMutationVariables>({
      query: (variables) => ({ document: ImportDatasetFromStorageDocument, variables })
    }),
    importAnalysisFromStorage: build.mutation<ImportAnalysisFromStorageMutation, ImportAnalysisFromStorageMutationVariables>({
      query: (variables) => ({ document: ImportAnalysisFromStorageDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


