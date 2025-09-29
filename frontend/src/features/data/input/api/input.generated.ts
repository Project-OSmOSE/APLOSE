import * as Types from '../../../_utils_/gql/types.generated';

import { gqlAPI } from '@/features/_utils_/gql/baseApi.ts';
export type GetDatasetsAndAnalysisQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetDatasetsAndAnalysisQuery = { __typename?: 'Query', allDatasets?: { __typename?: 'DatasetNodeNodeConnection', results: Array<{ __typename?: 'DatasetNode', pk: any, name: string, spectrogramAnalysis?: { __typename?: 'SpectrogramAnalysisNodeNodeConnection', results: Array<{ __typename?: 'SpectrogramAnalysisNode', pk: any, name: string, colormap: { __typename?: 'ColormapNode', name: string } } | null> } | null } | null> } | null };


export const GetDatasetsAndAnalysisDocument = `
    query getDatasetsAndAnalysis {
  allDatasets(orderBy: "name") {
    results {
      pk
      name
      spectrogramAnalysis(orderBy: "name") {
        results {
          pk
          name
          colormap {
            name
          }
        }
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    getDatasetsAndAnalysis: build.query<GetDatasetsAndAnalysisQuery, GetDatasetsAndAnalysisQueryVariables | void>({
      query: (variables) => ({ document: GetDatasetsAndAnalysisDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


