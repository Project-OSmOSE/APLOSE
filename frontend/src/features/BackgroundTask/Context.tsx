import React, { createContext, type ReactNode, useCallback, useMemo, useRef } from 'react';
import useWebSocket from 'react-use-websocket';

import Storage from '@/features/Storage';
import { useAppDispatch } from '@/features/App';

import type { CommandData, Event } from './types'
import { Slice } from './Slice';
import { getTokenFromCookie } from '@/api/utils';


type ContextType = {
    register(taskID: string): void;
    unregister(taskID: string): void;
    request(data: Omit<CommandData, 'token'>): void;
}

export const Context = createContext<ContextType>({
    register: async () => {
    },
    unregister: () => {
    },
    request: () => {
    },
})

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();

    const registeredListenerRef = useRef<Map<string, number>>(new Map()); // TaskID, listener count

    // WebSocket base handle
    const onMessage = useCallback((event: MessageEvent) => {
        const data = JSON.parse(event.data);
        data.data.other_info = JSON.parse(data.data.other_info);
        dispatch(Slice.actions.onTaskUpdated(data))
        dispatch(Storage.actions.onTaskUpdated(data))
    }, [ dispatch ])
    const websocketURL = useMemo(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${ protocol }//${ host }/ws/background-task/`;
    }, []);
    const { sendJsonMessage } = useWebSocket<Event>(
        websocketURL,
        {
            share: true,
            onMessage,
            retryOnError: true,
            reconnectInterval: (lastAttemptNumber) => 500 * lastAttemptNumber,
            reconnectAttempts: 3,
        },
    )

    // Handle requests
    const request = useCallback((data: Omit<CommandData, 'token'>) => {
        const token = getTokenFromCookie()
        if (!token) return;
        sendJsonMessage<CommandData>({ ...data, token }, true)
    }, [ sendJsonMessage, dispatch ])

    // Handle task listening
    const register = useCallback((identifier: string) => {
        const previousCount = registeredListenerRef.current.get(identifier) ?? 0
        if (previousCount == 0) {
            request({ command: 'subscribe', identifier })
        }
        registeredListenerRef.current.set(identifier, previousCount + 1)
    }, [ request ])

    const unregister = useCallback((identifier: string) => {
        const previousCount = registeredListenerRef.current.get(identifier) ?? 0
        if (previousCount == 0) return
        if (previousCount == 1) {
            request({ command: 'unsubscribe', identifier })
            dispatch(Slice.actions.clearTask(identifier))
            registeredListenerRef.current.delete(identifier)
        } else {
            registeredListenerRef.current.set(identifier, previousCount - 1)
        }
    }, [ request, dispatch ])

    return useMemo(() =>
            <Context.Provider value={ {
                register, unregister, request,
            } }>
                { children }
            </Context.Provider>
        ,
        [ children, register, unregister, request ],
    )
}