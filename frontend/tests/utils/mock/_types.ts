export type GqlMockType = 'filled' | 'empty'
export type RestStatus = 'forbidden'

export type GqlQuery<T, Type extends string = 'filled'> = { defaultType: Type, empty: T } & { [key in Type]: T }
export type RestQuery<T, Status extends RestStatus = never> = {
  url: string,
  success: { status: number, json: T }
} & {
  [key in Status]: { status: number, json?: any }
}

export type EmptyMutation = { empty: Record<string, never> }
export const EMPTY_MUTATION: EmptyMutation = { empty: {} }

export const PASSWORD = 'password'
