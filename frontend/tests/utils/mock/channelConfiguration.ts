import type { ChannelConfigurationsForDatasetQuery } from '../../../src/features/ChannelConfiguration';
import type { GqlQuery } from './_types';
import { deployment } from './types';


export const CHANNEL_CONFIGURATION_QUERIES: {
  channelConfigurationsForDataset: GqlQuery<ChannelConfigurationsForDatasetQuery>,
} = {
  channelConfigurationsForDataset: {
    defaultType: 'filled',
    empty: {
      allChannelConfigurations: null,
    },
    filled: {
      allChannelConfigurations: {
        results: [ { deployment } ],
      },
    },
  },
}
