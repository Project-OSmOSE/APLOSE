import type {
  CampaignNode,
  DeploymentNode,
  Maybe,
  ProjectNodeOverride,
  SiteNode,
} from '../../../src/api/types.gql-generated';
import type { ListChannelConfigurationsQuery } from '../../../src/api/channel-configuration';
import type { GqlQuery } from './_types';

export type Deployment = Pick<DeploymentNode, 'name'> & {
  campaign?: Maybe<Pick<CampaignNode, 'name'>>;
  site?: Maybe<Pick<SiteNode, 'name'>>;
  project: Pick<ProjectNodeOverride, 'name'>;
}
export const deployment: Deployment = {
  name: 'Test deployment',
  campaign: {
    name: 'Phase 1',
  },
  site: {
    name: 'Site A',
  },
  project: {
    name: 'Test Project',
  },
}

export const CHANNEL_CONFIGURATION_QUERIES: {
  listChannelConfigurations: GqlQuery<ListChannelConfigurationsQuery>,
} = {
  listChannelConfigurations: {
    empty: {
      allChannelConfigurations: null,
    },
    filled: {
      allChannelConfigurations: {
        results: [ {
          deployment,
        } ],
      },
    },
  },
}