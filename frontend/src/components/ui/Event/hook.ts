import { useCallback, useEffect } from 'react';
import { Signal } from 'signal-ts';
import { KEY_DOWN_EVENT, NON_FILTERED_KEY_DOWN_EVENT } from './events';


export const useRegisterToEvent = <T>(signal: Signal<T>, callback: (event: T) => void) => {
    useEffect(() => {
        signal.add(callback);
        return () => {
            signal.remove(callback);
        }
    }, [ callback ]);
}

export const useRegisterToKeyDownEvent = (keys: string[], callback: (event: KeyboardEvent) => void, filtered = true) => {
    const onKbdEvent = useCallback((event: KeyboardEvent) => {
        console.debug('onKbdEvent', keys.join(','), event.key)
        if (!keys.includes(event.key)) return
        event.preventDefault();
        callback(event);
    }, [ keys, callback ])
    useRegisterToEvent(filtered ? KEY_DOWN_EVENT : NON_FILTERED_KEY_DOWN_EVENT, onKbdEvent)
}


export const useRegisterToCtrlKeyDownEvent = (keys: string[], callback: (event: KeyboardEvent) => void, filtered = true) => {
    const onKbdEvent = useCallback((event: KeyboardEvent) => {
        if (!event.ctrlKey || !keys.includes(event.key)) return
        event.preventDefault();
        callback(event);
    }, [ keys, callback ])
    useRegisterToEvent(filtered ? KEY_DOWN_EVENT : NON_FILTERED_KEY_DOWN_EVENT, onKbdEvent)
}
