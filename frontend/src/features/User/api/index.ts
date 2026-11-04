import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import {
    AllUserGroupsDocument,
    type AllUserGroupsQuery,
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
    UpdateLabelDisplayPreferenceDocument,
    type UpdateLabelDisplayPreferenceMutation,
    type UpdateLabelDisplayPreferenceMutationVariables,
} from './user.generated'
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
export type { GetCurrentUserQuery as GetCurrentQuery } from './user.generated'

export const allQuery = queryOptions({
    queryKey: queryKeys.user.all,
    queryFn: () => graphqlClient.request<AllUsersQuery>(AllUsersDocument, {})
        .then(data => cleanGqlList(data.allUsers?.results)),
})
export type { AllUsersQuery as AllQuery } from './user.generated'

export const allGroupsQuery = queryOptions({
    queryKey: queryKeys.user.allGroups,
    queryFn: () => graphqlClient.request<AllUserGroupsQuery>(AllUserGroupsDocument, {})
        .then(data => cleanGqlList(data.allUserGroups?.results)),
})
export type { AllUserGroupsQuery as AllGroupsQuery } from './user.generated'

export const updateEmailMutation = mutationOptions({
    mutationFn: (variables: UpdateCurrentUserEmailMutationVariables) => graphqlClient.request<UpdateCurrentUserEmailMutation>(UpdateCurrentUserEmailDocument, variables)
        .then(data => data.currentUserUpdate),
    onSuccess: (_data, _variables, _onMutateResult, context) =>
        context.client.invalidateQueries({ queryKey: queryKeys.user.current }),
})

export const updatePasswordMutation = mutationOptions({
    mutationFn: (variables: UpdateCurrentUserPasswordMutationVariables) => graphqlClient.request<UpdateCurrentUserPasswordMutation>(UpdateCurrentUserPasswordDocument, variables)
        .then(data => data.userUpdatePassword),
})

export const updateLabelPreferenceMutation = mutationOptions({
    mutationFn: (variables: UpdateLabelDisplayPreferenceMutationVariables) =>
        graphqlClient.request<UpdateLabelDisplayPreferenceMutation>(UpdateLabelDisplayPreferenceDocument, variables)
        .then(data => data.currentUserUpdateLabelDisplayPreference),
    onSuccess: (_data, _variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.user.current }),
        context.client.invalidateQueries({ queryKey: queryKeys.campaign.labelsByIdBase }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.allLabels }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.source.all }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.sound.all }),
    ])
})


export type {
    UserFragment as Fragment,
    UserGroupFragment as GroupFragment,
} from './user.generated'
export {
    LabelDisplayPreferenceType
} from '@/api/types.gql-generated.ts'
