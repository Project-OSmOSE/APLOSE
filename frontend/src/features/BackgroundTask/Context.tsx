import React, { createContext, type ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { ReadyState } from 'react-use-websocket/src/lib/constants';

import Storage from '@/features/Storage';
import { gqlAPI } from '@/api/baseGqlApi';
import { useAppDispatch } from '@/features/App';

import { BackgroundTaskCommand, type BackgroundTaskUpdateEvent } from './types'
import { Slice } from './Slice';


type ContextType = {
    register(taskID: string): void;
    unregister(taskID: string): void;
    request(data: BackgroundTaskCommand): void;
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
    const [ requestStack, setRequestStack ] = useState<BackgroundTaskCommand[]>([])

    // WebSocket base handle
    const onMessage = useCallback((event: MessageEvent) => {
        const data = JSON.parse(event.data);
        dispatch(Slice.actions.onTaskUpdated(data))
        dispatch(Storage.actions.onTaskUpdated(data))
    }, [ dispatch ])
    const websocketURL = useMemo(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${ protocol }//${ host }/ws/background-task/`;
    }, []);
    const { sendJsonMessage, readyState } = useWebSocket<BackgroundTaskUpdateEvent>(
        websocketURL,
        {
            share: true,
            onMessage,
            onOpen: () => {
                for (const taskID of registeredListenerRef.current.keys()) sendJsonMessage({
                    command: 'add',
                    task_id: taskID,
                } satisfies BackgroundTaskCommand);
                for (const request of requestStack) sendJsonMessage(request)
            },
            retryOnError: true,
            reconnectInterval: (lastAttemptNumber) => 500 * lastAttemptNumber,
            reconnectAttempts: 3,
        },
    )

    // Handle requests
    const request = useCallback((data: BackgroundTaskCommand) => {
        if (readyState === ReadyState.OPEN) {
            sendJsonMessage(data)
            if (data.command === 'retry') {
                dispatch(gqlAPI.util.invalidateTags([ 'SpectrogramAnalysis' ]))
            }
        } else {
            setRequestStack(prev => [ ...prev, data ]);
        }
    }, [ readyState, sendJsonMessage, dispatch ])

    // Handle task listening
    const register = useCallback((taskID: string) => {
        const previousCount = registeredListenerRef.current.get(taskID) ?? 0
        if (previousCount == 0 && readyState === ReadyState.OPEN) {
            sendJsonMessage({ command: 'add', task_id: taskID } satisfies BackgroundTaskCommand)
        }
        registeredListenerRef.current.set(taskID, previousCount + 1)
    }, [ request, readyState, sendJsonMessage ])
    const unregister = useCallback((taskID: string) => {
        const previousCount = registeredListenerRef.current.get(taskID) ?? 0
        if (previousCount == 0) return
        if (previousCount == 1 && readyState === ReadyState.OPEN) {
            sendJsonMessage({ command: 'remove', task_id: taskID } satisfies BackgroundTaskCommand)
            dispatch(Slice.actions.clearTask(taskID))
            registeredListenerRef.current.delete(taskID)
        } else {
            registeredListenerRef.current.set(taskID, previousCount - 1)
        }
    }, [ request, dispatch, readyState, sendJsonMessage ])

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