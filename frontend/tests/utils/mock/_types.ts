import { ErrorType } from '../../../src/api';

export type GqlMockType = 'filled' | 'empty'
export type RestStatus = 'forbidden'

export type GqlQuery<T, Type extends string = 'filled'> =
  { defaultType: Type | 'empty', empty: T }
  & { [key in Type]: T }
export type RestQuery<T, Status extends RestStatus = never> = {
  url: string,
  success: { status: number, json: T }
} & {
  [key in Status]: { status: number, json?: any }
}

export type EmptyMutation = { empty: Record<string, never> }
export const EMPTY_MUTATION: EmptyMutation = { empty: {} }

export const PASSWORD = 'password'

export function mockError(field: string): string {
  return `Custom error for ${ field }`;
}

export function mockGqlError<T extends { [key in string]: any }>(field: keyof T): ErrorType {
  return {
    field: field as string,
    messages: [ mockError(field as string) ],
  }
}
