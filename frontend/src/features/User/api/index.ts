import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllUsersDocument,
    type AllUsersQuery,
    type CurrentUserFragment,
    GetCurrentUserDocument,
    GetCurrentUserQuery,
} from './user.generated'
import { queryClient } from '@/api/queryClient';
import { cleanGqlList } from '@/api/utils';


export const currentQuery = queryOptions({
    queryKey: queryKeys.user.current,
    queryFn: () => graphqlClient.request<GetCurrentUserQuery>(GetCurrentUserDocument, {})
        .then(data => data.currentUser!),
})

export const currentQueryCache = () => {
    return queryClient.getQueryCache().find<CurrentUserFragment>({ queryKey: queryKeys.user.current })
}

export const allQuery = queryOptions({
    queryKey: queryKeys.user.all,
    queryFn: () => graphqlClient.request<AllUsersQuery>(AllUsersDocument, {})
        .then(data => ({
            users: cleanGqlList(data.allUsers?.results),
            groups: cleanGqlList(data.allUserGroups?.results),
        })),
    initialData: { users: [], groups: [] },
})


export type * from './user.generated'