export type GqlMockType = 'filled' | 'empty'
export type RestStatus = 'forbidden'

export type GqlQuery<T> = { [key in GqlMockType]: T }
export type RestQuery<T, Status extends RestStatus = never> = {
  url: string,
  success: { status: number, json: T }
} & {
  [key in Status]: { status: number, json?: any }
}

export type EmptyMutation = { empty: Record<string, never> }
export const EMPTY_MUTATION: EmptyMutation = { empty: {} }

export const PASSWORD = 'password'
