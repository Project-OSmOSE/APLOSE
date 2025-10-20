import { ChannelConfigurationGqlAPI } from './api';
import { useMemo } from 'react';
import { ListChannelConfigurationsQueryVariables } from './channel-configuration.generated';

const {
  listChannelConfigurations,
} = ChannelConfigurationGqlAPI.endpoints

export const useAllChannelConfigurations = (variables: ListChannelConfigurationsQueryVariables) => {
  const info = listChannelConfigurations.useQuery(variables);
  return useMemo(() => ({
    ...info,
    allChannelConfigurations: info.data?.allChannelConfigurations?.results.filter(s => s !== null).map(s => s!),
  }), [ info ]);
}
