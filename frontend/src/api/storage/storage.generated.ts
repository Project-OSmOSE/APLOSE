import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type BrowseStorageQueryVariables = Types.Exact<{
  path: Types.Scalars['String']['input'];
}>;


export type BrowseStorageQuery = { __typename?: 'Query', browse?: Array<{ __typename: 'AnalysisStorageNode', name: string, path: string, importStatus: Types.ImportStatus, model?: { __typename?: 'SpectrogramAnalysisNode', annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'DatasetStorageNode', name: string, path: string, importStatus: Types.ImportStatus, error?: string | null, stack?: string | null, model?: { __typename?: 'DatasetNode', id: string, annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'FolderNode', name: string, path: string, error?: string | null, stack?: string | null } | null> | null };

export type SearchStorageQueryVariables = Types.Exact<{
  path: Types.Scalars['String']['input'];
}>;


export type SearchStorageQuery = { __typename?: 'Query', search?: { __typename: 'AnalysisStorageNode', name: string, path: string, importStatus: Types.ImportStatus, model?: { __typename?: 'SpectrogramAnalysisNode', annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'DatasetStorageNode', name: string, path: string, importStatus: Types.ImportStatus, error?: string | null, stack?: string | null, model?: { __typename?: 'DatasetNode', id: string, annotationCampaigns: { __typename?: 'AnnotationCampaignNodeConnection', edges: Array<{ __typename?: 'AnnotationCampaignNodeEdge', node?: { __typename?: 'AnnotationCampaignNode', isArchived: boolean } | null } | null> } } | null } | { __typename: 'FolderNode', name: string, path: string, error?: string | null, stack?: string | null } | null };

export type ImportDatasetFromStorageMutationVariables = Types.Exact<{
  datasetPath: Types.Scalars['String']['input'];
  analysisPath?: Types.InputMaybe<Types.Scalars['String']['input']>;
}>;


export type ImportDatasetFromStorageMutation = { __typename?: 'Mutation', importDataset?: { __typename?: 'ImportDatasetMutation', dataset: { __typename?: 'DatasetNode', path: string } } | null };


export const BrowseStorageDocument = `
    query browseStorage($path: String!) {
  browse(path: $path) {
    ... on FolderNode {
      __typename
      name
      path
      error
      stack
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
      error
      stack
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
      error
      stack
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
      error
      stack
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
    mutation importDatasetFromStorage($datasetPath: String!, $analysisPath: String) {
  importDataset(datasetPath: $datasetPath, analysisPath: $analysisPath) {
    dataset {
      path
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    browseStorage: build.query<BrowseStorageQuery, BrowseStorageQueryVariables>({
      query: (variables) => ({ document: BrowseStorageDocument, variables })
    }),
    searchStorage: build.query<SearchStorageQuery, SearchStorageQueryVariables>({
      query: (variables) => ({ document: SearchStorageDocument, variables })
    }),
    importDatasetFromStorage: build.mutation<ImportDatasetFromStorageMutation, ImportDatasetFromStorageMutationVariables>({
      query: (variables) => ({ document: ImportDatasetFromStorageDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


