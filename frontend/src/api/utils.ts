import type { Token } from '@/api/auth';
import type { ErrorType } from '@/api/types.gql-generated';
import { useCallback, useRef } from 'react';

export function getTokenFromCookie(): Token | undefined {
    const tokenCookie = document.cookie?.split(';').filter((item) => item.trim().startsWith('token='))[0];
    return tokenCookie?.split('=').pop();
}

export function prepareHeaders(headers: Headers) {
    // Set Authorization
    const token = getTokenFromCookie();
    if (token) headers.set('Authorization', `Bearer ${ token }`);

    return headers;
}

export type GqlError<T extends { [key in string]: any }> = ErrorType & { field: keyof T }

export const useWS = () => {
    const websocketRef = useRef<WebSocket | null>(null);

    const onMessage = useCallback((event: MessageEvent) => {
        console.debug(`message`, event)
    }, [])

    const onError = useCallback((event: Event) => {
        console.debug(`error`, event)
    }, [])

    const onClose = useCallback((event: CloseEvent) => {
        console.debug(`close`, event)
    }, [])

    const open = useCallback(() => {
        return new Promise((resolve, reject) => {
            const url = `ws://${ window.location.host }/ws/background-task/`
            websocketRef.current = new WebSocket(url)
            websocketRef.current.onmessage = onMessage
            websocketRef.current.onerror = e => {
                onError(e)
                reject(e)
            }
            websocketRef.current.onclose = onClose
            websocketRef.current.onopen = resolve
        })
    }, [ onMessage, onError, onClose ])

    const close = useCallback(() => {
        websocketRef.current?.close(undefined, 'user requested close')
    }, [])

    const listen = useCallback(({ taskID }: { taskID: string }) => {
        websocketRef.current?.send(JSON.stringify({ command: 'add', task_id: taskID }))
    }, [])

    return { open, close, listen }
}
