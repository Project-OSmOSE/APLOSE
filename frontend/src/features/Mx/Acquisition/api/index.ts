import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { optimisticMutationOptions } from '@/api/utils';
import {
    ImportShortAcquisitionsDocument,
    type ImportShortAcquisitionsMutation,
    type ImportShortAcquisitionsMutationVariables,
} from './Acquisition.generated';


export const importShortAcquisitions = optimisticMutationOptions({
    mutationKey: queryKeys.mx.acquisition.allChannelConfigurations,
    mutationFn: (input: ImportShortAcquisitionsMutationVariables['input']) =>
        graphqlClient.request<ImportShortAcquisitionsMutation>(ImportShortAcquisitionsDocument, { input }),
})

export type * from './Acquisition.generated'
