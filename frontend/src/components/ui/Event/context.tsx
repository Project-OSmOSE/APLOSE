import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
    AUX_CLICK_EVENT,
    CLICK_EVENT,
    KEY_DOWN_EVENT,
    MOUSE_DOWN_EVENT,
    MOUSE_MOVE_EVENT,
    MOUSE_UP_EVENT,
    NON_FILTERED_KEY_DOWN_EVENT,
} from './events';

// Based on https://medium.com/@mayankvishwakarma.dev/building-an-Event-provider-in-react-using-context-and-custom-hooks-7c90931de088

type EventContext = {
    areKbdShortcutsEnabled: boolean
    enableShortcuts: () => void
    disableShortcuts: () => void
};

type EventContextProvider = {
    children: ReactNode;
};

export const EventContext = createContext<EventContext>({
    areKbdShortcutsEnabled: true,
    enableShortcuts: () => undefined,
    disableShortcuts: () => undefined,
})

export const useEvent = () => {
    const context = useContext(EventContext);
    if (!context) {
        throw new Error('useEvent must be used within a EventProvider');
    }
    return context;
}

export const EventProvider: React.FC<EventContextProvider> = ({ children }) => {
    const [ areKbdShortcutsEnabled, setAreKbdShortcutsEnabled ] = useState<boolean>(true);
    const areKbdShortcutsEnabledRef = useRef<boolean>(areKbdShortcutsEnabled);

    const enableShortcuts = useCallback(() => {
        setAreKbdShortcutsEnabled(true)
        areKbdShortcutsEnabledRef.current = true
    }, []);
    const disableShortcuts = useCallback(() => {
        setAreKbdShortcutsEnabled(false)
        areKbdShortcutsEnabledRef.current = false
    }, []);


    const onKeyDown = useCallback((event: KeyboardEvent) => {
        NON_FILTERED_KEY_DOWN_EVENT.emit(event);
        if (!areKbdShortcutsEnabledRef.current) return;

        KEY_DOWN_EVENT.emit(event);
    }, [])

    const onMouseDown = useCallback((event: MouseEvent) => {
        MOUSE_DOWN_EVENT.emit(event);
    }, [])

    const onMouseMove = useCallback((event: MouseEvent) => {
        MOUSE_MOVE_EVENT.emit(event);
    }, [])

    const onMouseUp = useCallback((event: MouseEvent) => {
        MOUSE_UP_EVENT.emit(event);
    }, [])

    const onClick = useCallback((event: MouseEvent) => {
        CLICK_EVENT.emit(event);
    }, [])

    const onAuxClick = useCallback((event: MouseEvent) => {
        AUX_CLICK_EVENT.emit(event);
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown.bind(this));
        document.addEventListener('mousedown', onMouseDown.bind(this));
        document.addEventListener('mousemove', onMouseMove.bind(this));
        document.addEventListener('mouseup', onMouseUp.bind(this));
        document.addEventListener('click', onClick.bind(this));
        document.addEventListener('auxclick', onAuxClick.bind(this));

        return () => {
            document.removeEventListener('keydown', onKeyDown.bind(this));
            document.removeEventListener('mousedown', onMouseDown.bind(this));
            document.removeEventListener('mousemove', onMouseMove.bind(this));
            document.removeEventListener('mouseup', onMouseUp.bind(this));
            document.removeEventListener('click', onClick.bind(this));
            document.removeEventListener('auxclick', onAuxClick.bind(this));
        }
    }, []);

    return <EventContext.Provider children={ children }
                                  value={ {
                                      areKbdShortcutsEnabled,
                                      enableShortcuts,
                                      disableShortcuts,
                                  } }/>
}
