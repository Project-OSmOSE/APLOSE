import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';

export type Position = { clientX: number, clientY: number }
export type TimeFreqPosition = { time: number, frequency: number }

type PointerContext = {
    position?: TimeFreqPosition,

    setPosition: (position: TimeFreqPosition) => void,
    clearPosition: () => void,
};

type PointerContextProvider = {
    children: ReactNode;
};

export const PointerContext = createContext<PointerContext>({
    setPosition: () => {
    },
    clearPosition: () => {
    },
})

export const PointerProvider: React.FC<PointerContextProvider> = ({ children }) => {
    const rafID = useRef<number | undefined>();
    const [ position, setPosition ] = useState<TimeFreqPosition | undefined>();

    const updatePosition = useCallback((position?: TimeFreqPosition) => {
        if (rafID.current) {
            cancelAnimationFrame(rafID.current);
        }
        rafID.current = requestAnimationFrame(() => setPosition(position));
    }, [])

    return (
        <PointerContext.Provider value={ {
            position,
            setPosition: updatePosition,
            clearPosition: updatePosition,
        } }>
            { children }
        </PointerContext.Provider>
    )
}

export const usePointer = () => {
    const context = useContext(PointerContext);
    if (!context) {
        throw new Error('usePointer must be used within a PointerProvider');
    }
    return context;
}
