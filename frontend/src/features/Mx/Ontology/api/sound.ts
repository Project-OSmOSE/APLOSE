import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import { graphqlClient } from '@/api/graphqlClient';
import { cleanGqlList, optimisticMutationOptions } from '@/api/utils';
import {
    AllSoundsDocument,
    type AllSoundsQuery,
    DeleteSoundDocument,
    type DeleteSoundMutation,
    type DeleteSoundMutationVariables,
    DetailedSoundByIdDocument,
    type DetailedSoundByIdQuery,
    type DetailedSoundByIdQueryVariables,
    PostSoundDocument,
    type PostSoundMutation,
} from './Ontology.generated';
import type { PostSoundMutationInput, } from '@/api/types.gql-generated.ts'

export const allSounds = queryOptions({
    queryKey: queryKeys.mx.ontology.sound.all,
    queryFn: () => graphqlClient.request<AllSoundsQuery>(AllSoundsDocument, {})
        .then(data => cleanGqlList(data.allSounds?.results)),
})

export const soundById = (variables: DetailedSoundByIdQueryVariables) => queryOptions({
    queryKey: queryKeys.mx.ontology.sound.byID(variables),
    queryFn: () => graphqlClient.request<DetailedSoundByIdQuery>(DetailedSoundByIdDocument, variables)
        .then(data => data.soundById)
})

export type CreateSoundInput = Omit<PostSoundMutationInput, 'id'>
export const createSound = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.sound.all,
    mutationFn: (input: CreateSoundInput) => graphqlClient.request<PostSoundMutation>(PostSoundDocument, { input })
            .then(data => data.postSound),
    onSettled: (_data, _error, _variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.sound.all }),
    ])
})

export type UpdateSoundInput = PostSoundMutationInput & { id: NonNullable<PostSoundMutationInput['id']> }
export const updateSound = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.sound.all,
    mutationFn: (input: UpdateSoundInput) =>
        graphqlClient.request<PostSoundMutation>(PostSoundDocument, { input })
            .then(data => data.postSound),
    onSettled: (_data, _error, variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.sound.all }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.sound.byID(variables) }),
    ])
})

export const deleteSound = optimisticMutationOptions({
    mutationKey: queryKeys.mx.ontology.sound.all,
    mutationFn: (input: DeleteSoundMutationVariables) =>
        graphqlClient.request<DeleteSoundMutation>(DeleteSoundDocument, { input })
            .then(data => data.deleteSound),
    onSettled: (_data, _error, variables, _onMutateResult, context) => Promise.all([
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.sound.all }),
        context.client.invalidateQueries({ queryKey: queryKeys.mx.ontology.sound.byID(variables) }),
    ])
})


export type {
    SoundFragment,
    DetailedSoundFragment,
} from './Ontology.generated';