export type MockType = 'filled' | 'empty'

export type GqlQuery<T> = { [key in MockType]: T }

export type EmptyMutation = { empty: Record<string, never> }
export const EMPTY_MUTATION: EmptyMutation = { empty: {} }
