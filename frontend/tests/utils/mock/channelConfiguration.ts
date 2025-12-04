import type { ListChannelConfigurationsQuery } from '../../../src/api/channel-configuration';
import type { GqlQuery } from './_types';
import { deployment } from './types';


export const CHANNEL_CONFIGURATION_QUERIES: {
  listChannelConfigurations: GqlQuery<ListChannelConfigurationsQuery>,
} = {
  listChannelConfigurations: {
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
