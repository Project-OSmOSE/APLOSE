import type { RestQuery } from './_types';

export const TOKEN = '<TOKEN>'
export const TOKEN_ERROR = 'TOKEN error'

export const AUTH_QUERIES: {
  token: RestQuery<{ detail?: string }, 'forbidden'>
} = {
  token: {
    url: '/api/token/',
    success: {
      status: 200,
      json: { detail: TOKEN },
    },
    forbidden: {
      status: 401,
      json: { detail: TOKEN_ERROR },
    },
  },
}
