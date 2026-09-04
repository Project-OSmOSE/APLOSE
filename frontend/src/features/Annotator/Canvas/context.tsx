import React, {
    createContext,
    type Dispatch,
    type MutableRefObject,
    ReactNode,
    type SetStateAction,
    useContext,
    useRef, useState,
} from 'react';

type AnnotatorCanvasContext = {
    windowCanvasRef?: MutableRefObject<HTMLDivElement | null>,
    displayCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
    interactionCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
    xAxisCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
    yAxisCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,

    left: number;
    setLeft: Dispatch<SetStateAction<number>>;
}

export const AnnotatorCanvasContext = createContext<AnnotatorCanvasContext>({
    left: 0, setLeft: () => undefined,
})

export const useAnnotatorCanvasContext = () => {
    const context = useContext(AnnotatorCanvasContext);
    if (!context) {
        throw new Error('useAnnotatorCanvas must be used within a AnnotatorCanvasContextProvider');
    }
    return context;
}

export const AnnotatorCanvasContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const windowCanvasRef = useRef<HTMLDivElement | null>(null)
    const displayCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const interactionCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const xAxisCanvasRef = useRef<HTMLCanvasElement | null>(null)
    const yAxisCanvasRef = useRef<HTMLCanvasElement | null>(null)

    const [ left, setLeft ] = useState<number>(0);

    return <AnnotatorCanvasContext.Provider children={ children }
                                            value={ {
                                                windowCanvasRef,
                                                displayCanvasRef,
                                                interactionCanvasRef,
                                                xAxisCanvasRef,
                                                yAxisCanvasRef,

                                                left, setLeft,
                                            } }/>;
}
