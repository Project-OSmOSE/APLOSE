import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import {
    ChannelConfigurationsForDatasetDocument,
    type ChannelConfigurationsForDatasetQuery,
    type ChannelConfigurationsForDatasetQueryVariables,
} from './channel-configuration.generated'

export const forDatasetQuery = (variables: ChannelConfigurationsForDatasetQueryVariables) => queryOptions({
    queryKey: queryKeys.channelConfigurations.forDataset(variables),
    queryFn: () => graphqlClient.request<ChannelConfigurationsForDatasetQuery>(ChannelConfigurationsForDatasetDocument, variables)
        .then(data => cleanGqlList(data.allChannelConfigurations?.results)),
})

export type * from './channel-configuration.generated'