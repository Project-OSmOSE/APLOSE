import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllUsersDocument,
    type AllUsersQuery,
    GetCurrentUserDocument,
    GetCurrentUserQuery,
    UpdateCurrentUserEmailDocument,
    type UpdateCurrentUserEmailMutation,
    type UpdateCurrentUserEmailMutationVariables,
    UpdateCurrentUserPasswordDocument,
    type UpdateCurrentUserPasswordMutation,
    type UpdateCurrentUserPasswordMutationVariables,
} from './user.generated'
import { queryClient } from '@/api/queryClient';
import { cleanGqlList } from '@/api/utils';


export const currentQuery = queryOptions({
    queryKey: queryKeys.user.current,
    queryFn: () => graphqlClient.request<GetCurrentUserQuery>(GetCurrentUserDocument, {})
        .then(data => data.currentUser!)
        .catch(e => {
            if (e.message === 'Unauthorized') return null
            throw e
        }),
})

export const allQuery = queryOptions({
    queryKey: queryKeys.user.all,
    queryFn: () => graphqlClient.request<AllUsersQuery>(AllUsersDocument, {})
        .then(data => ({
            users: cleanGqlList(data.allUsers?.results),
            groups: cleanGqlList(data.allUserGroups?.results),
        })),
})

export const updateEmailMutation = mutationOptions({
    mutationFn: (variables: UpdateCurrentUserEmailMutationVariables) => graphqlClient.request<UpdateCurrentUserEmailMutation>(UpdateCurrentUserEmailDocument, variables)
        .then(data => data.currentUserUpdate),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.user.current }),
})

export const updatePasswordMutation = mutationOptions({
    mutationFn: (variables: UpdateCurrentUserPasswordMutationVariables) => graphqlClient.request<UpdateCurrentUserPasswordMutation>(UpdateCurrentUserPasswordDocument, variables)
        .then(data => data.userUpdatePassword),
})


export type * from './user.generated'