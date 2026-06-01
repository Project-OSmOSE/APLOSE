import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { type CurrentUserFragment, GetCurrentUserDocument, GetCurrentUserQuery } from './user.generated'
import { queryClient } from '@/api/queryClient';


export const currentQuery = queryOptions({
    queryKey: queryKeys.user.current,
    queryFn: () => graphqlClient.request<GetCurrentUserQuery>(GetCurrentUserDocument, {})
        .then(data => data.currentUser!),
})

export const currentQueryCache = () => {
    return queryClient.getQueryCache().find<CurrentUserFragment>({ queryKey: queryKeys.user.current })
}


export type * from './user.generated'