import type { RequestExtendedOptions } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import { getTokenFromCookie } from '@/api/utils';


/**
 * Middleware pour ajouter le token aux requêtes
 */
const requestMiddleware = async (request: any) => {
    const token = getTokenFromCookie();

    if (!token) {
        document.cookie = 'token=;max-age=0;path=/';
        throw new Error('Unauthorized');
    }

    if (token) {
        request.headers = request.headers ?? {}
        request.headers.Authorization = `Bearer ${ token }`;
    }

    return request;
}

/**
 * Middleware pour gérer les erreurs GraphQL
 */
const responseMiddleware = (response: any) => {
    // Gestion des erreurs d'authentification
    const errors = response.errors ?? response.response?.errors
    if (errors) {
        const hasAuthError = errors.some((err: any) =>
            err.message?.includes('Unauthorized') ||
            err.extensions?.code === 'UNAUTHENTICATED',
        );

        if (hasAuthError) {
            document.cookie = 'token=;max-age=0;path=/';
            throw new Error('Unauthorized');
        }

    }

    return response;
}

/**
 * Client GraphQL pré-configuré
 */
export const graphqlClient = new GraphQLClient(
    process.env.REACT_APP_GRAPHQL_ENDPOINT || '/api/graphql',
    {
        requestMiddleware,
        responseMiddleware,
    },
);

export type RequestOptions = RequestExtendedOptions;
