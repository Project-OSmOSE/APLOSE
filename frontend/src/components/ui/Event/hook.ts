import { useEffect } from 'react';
import { Signal } from 'signal-ts';


export const useRegisterToEvent = <T>(signal: Signal<T>, callback: (event: T) => void) => {
    useEffect(() => {
        signal.add(callback);
        return () => {
            signal.remove(callback);
        }
    }, [ callback ]);
}
