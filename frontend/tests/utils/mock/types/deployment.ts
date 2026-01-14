import type {
  CampaignNode,
  DeploymentNode,
  Maybe,
  ProjectNodeOverride,
  SiteNode,
} from '../../../../src/api/types.gql-generated';

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
