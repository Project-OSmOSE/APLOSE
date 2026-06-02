import { mutationOptions, queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList } from '@/api/utils';
import { queryClient } from '@/api/queryClient';
import {
    CreateSoundDocument,
    type CreateSoundMutation,
    type CreateSoundMutationVariables,
    DeleteSoundDocument,
    type DeleteSoundMutation,
    type DeleteSoundMutationVariables,
    GetAllSoundsDocument,
    type GetAllSoundsQuery,
    GetDetailedSoundByIdDocument,
    type GetDetailedSoundByIdQuery,
    type GetDetailedSoundByIdQueryVariables,
    UpdateSoundDocument,
    type UpdateSoundMutation,
    type UpdateSoundMutationVariables,
} from './sound.generated'


export const soundByIdQuery = (variables: GetDetailedSoundByIdQueryVariables) => queryOptions({
    queryKey: queryKeys.ontology.sound.byId(variables),
    queryFn: () => graphqlClient.request<GetDetailedSoundByIdQuery>(GetDetailedSoundByIdDocument, {})
        .then(data => data.soundById),
})

export const allSoundsQuery = queryOptions({
    queryKey: queryKeys.ontology.sound.all,
    queryFn: () => graphqlClient.request<GetAllSoundsQuery>(GetAllSoundsDocument, {})
        .then(data => cleanGqlList(data.allSounds?.results)),
})

export const createSoundMutation = mutationOptions({
    mutationFn: (variables: CreateSoundMutationVariables) => graphqlClient.request<CreateSoundMutation>(CreateSoundDocument, variables),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.ontology.sound.all }),
})

export const updateSoundMutation = mutationOptions({
    mutationFn: (variables: UpdateSoundMutationVariables) => graphqlClient.request<UpdateSoundMutation>(UpdateSoundDocument, variables),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.sound.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.sound.byId({ id: variables.id }) })
    },
})

export const deleteSoundMutation = mutationOptions({
    mutationFn: (variables: DeleteSoundMutationVariables) => graphqlClient.request<DeleteSoundMutation>(DeleteSoundDocument, variables),
    onSuccess: (_data, variables) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.sound.all })
        queryClient.invalidateQueries({ queryKey: queryKeys.ontology.sound.byId({ id: variables.id }) })
    },
})

export type * from './sound.generated'
