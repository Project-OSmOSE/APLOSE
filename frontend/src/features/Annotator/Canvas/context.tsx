import React, { createContext, type MutableRefObject, ReactNode, useContext, useRef } from 'react';

type AnnotatorCanvasContext = {
  windowCanvasRef?: MutableRefObject<HTMLDivElement | null>,
  mainCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
  xAxisCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
  yAxisCanvasRef?: MutableRefObject<HTMLCanvasElement | null>,
}

export const AnnotatorCanvasContext = createContext<AnnotatorCanvasContext>({})

export const useAnnotatorCanvasContext = () => {
  const context = useContext(AnnotatorCanvasContext);
  if (!context) {
    throw new Error('useAnnotatorCanvas must be used within a AnnotatorCanvasContextProvider');
  }
  return context;
}

export const AnnotatorCanvasContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const windowCanvasRef = useRef<HTMLDivElement | null>(null)
  const mainCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const xAxisCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const yAxisCanvasRef = useRef<HTMLCanvasElement | null>(null)

  return <AnnotatorCanvasContext.Provider children={ children }
                                          value={ {
                                            windowCanvasRef,
                                            mainCanvasRef,
                                            xAxisCanvasRef,
                                            yAxisCanvasRef,
                                          } }/>;
}
