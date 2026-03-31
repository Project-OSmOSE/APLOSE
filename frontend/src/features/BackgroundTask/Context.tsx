import React, { createContext, type ReactNode, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useAppDispatch } from '@/features/App';
import { BackgroundTaskCommand, type BackgroundTaskUpdateEvent } from './types'
import { BackgroundTaskSlice } from './Slice';
import { StorageSlice } from '@/api';
// import { useWebSocket, WebSocketStatus } from '@/api/websocket';
import { gqlAPI } from '@/api/baseGqlApi';
import useWebSocket from 'react-use-websocket';
import { ReadyState } from 'react-use-websocket/src/lib/constants';


type BackgroundTaskContext = {
    register(taskID: string): void;
    unregister(taskID: string): void;
    request(data: BackgroundTaskCommand): void;
}

export const BackgroundTaskContext = createContext<BackgroundTaskContext>({
    register: async () => {
    },
    unregister: () => {
    },
    request: () => {
    },
})

export const useBackgroundTask = () => {
    const context = useContext(BackgroundTaskContext);
    if (!context) {
        throw new Error('useBackgroundTask must be used within a BackgroundTaskProvider');
    }
    return context;
}

export const BackgroundTaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch();

    const registeredListenerRef = useRef<Map<string, number>>(new Map()); // TaskID, listener count
    const [ requestStack, setRequestStack ] = useState<BackgroundTaskCommand[]>([])

    // WebSocket base handle
    const onMessage = useCallback((event: MessageEvent) => {
        const data = JSON.parse(event.data);
        dispatch(BackgroundTaskSlice.actions.onTaskUpdated(data))
        dispatch(StorageSlice.actions.onTaskUpdated(data))
    }, [ dispatch ])
    const websocketURL = useMemo(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${ protocol }//${ host }/ws/background-task/`;
    }, [ ]);
    const { sendJsonMessage, readyState } = useWebSocket<BackgroundTaskUpdateEvent>(
        websocketURL,
        {
            onMessage,
            onOpen: () => {
                for (const taskID of registeredListenerRef.current.keys()) sendJsonMessage({ command: 'add', task_id: taskID } satisfies BackgroundTaskCommand);
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
            dispatch(BackgroundTaskSlice.actions.clearTask(taskID))
            registeredListenerRef.current.delete(taskID)
        } else {
            registeredListenerRef.current.set(taskID, previousCount - 1)
        }
    }, [ request, dispatch, readyState, sendJsonMessage ])

    return useMemo(() =>
            <BackgroundTaskContext.Provider value={ {
                register, unregister, request,
            } }>
                { children }
            </BackgroundTaskContext.Provider>
        ,
        [ children, register, unregister, request ],
    )
}