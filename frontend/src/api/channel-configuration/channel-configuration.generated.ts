import * as Types from '../types.gql-generated';

import { gqlAPI } from '@/api/baseGqlApi';
export type ListChannelConfigurationsQueryVariables = Types.Exact<{
  datasetID?: Types.InputMaybe<Types.Scalars['ID']['input']>;
}>;


export type ListChannelConfigurationsQuery = { __typename?: 'Query', allChannelConfigurations?: { __typename?: 'ChannelConfigurationNodeNodeConnection', results: Array<{ __typename?: 'ChannelConfigurationNode', deployment: { __typename?: 'DeploymentNode', name?: string | null, campaign?: { __typename?: 'CampaignNode', name: string } | null, site?: { __typename?: 'SiteNode', name: string } | null, project: { __typename?: 'ProjectNodeOverride', name: string } }, recorderSpecification?: { __typename?: 'ChannelConfigurationRecorderSpecificationNode', recorder: { __typename?: 'EquipmentNode', serialNumber: string, model: string }, hydrophone: { __typename?: 'EquipmentNode', serialNumber: string, model: string } } | null, detectorSpecification?: { __typename?: 'ChannelConfigurationDetectorSpecificationNode', detector: { __typename?: 'EquipmentNode', serialNumber: string, model: string } } | null } | null> } | null };


export const ListChannelConfigurationsDocument = `
    query listChannelConfigurations($datasetID: ID) {
  allChannelConfigurations(datasetId: $datasetID) {
    results {
      deployment {
        name
        campaign {
          name
        }
        site {
          name
        }
        project {
          name
        }
      }
      recorderSpecification {
        recorder {
          serialNumber
          model
        }
        hydrophone {
          serialNumber
          model
        }
      }
      detectorSpecification {
        detector {
          serialNumber
          model
        }
      }
    }
  }
}
    `;

const injectedRtkApi = gqlAPI.injectEndpoints({
  endpoints: (build) => ({
    listChannelConfigurations: build.query<ListChannelConfigurationsQuery, ListChannelConfigurationsQueryVariables | void>({
      query: (variables) => ({ document: ListChannelConfigurationsDocument, variables })
    }),
  }),
});

export { injectedRtkApi as api };


