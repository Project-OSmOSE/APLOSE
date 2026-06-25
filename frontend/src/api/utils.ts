import type { Errors } from '@base-ui/react/internals/form-context';
import type { ErrorType } from '@/api/types.gql-generated';
import { Token } from './auth/types';

export function getTokenFromCookie(): Token | undefined {
    const tokenCookie = document.cookie?.split(';').filter((item) => item.trim().startsWith('token='))[0];
    return tokenCookie?.split('=').pop();
}

export function clearTokenFromCookie(): void {
    document.cookie = 'token=;max-age=0;path=/';
}

export function prepareHeaders(headers: Headers) {
    // Set Authorization
    const token = getTokenFromCookie();
    if (token) headers.set('Authorization', `Bearer ${ token }`);

    return headers;
}


export function cleanGqlList<T>(data?: Array<T | undefined | null> | null): Array<T> {
    return data?.filter(d => !!d).map(d => d!) ?? []
}

export function cleanGqlErrors(errors?: Array<ErrorType | null> | null): Errors {
    return cleanGqlList(errors).reduce((prev, current) => ({
        ...prev,
        [current.field]: current.messages,
    }), {})
}
