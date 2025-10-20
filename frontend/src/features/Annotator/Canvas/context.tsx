import React, { createContext, ReactNode, useContext, useState } from 'react';

type AnnotatorCanvasContext = {
  window?: HTMLDivElement,
  setWindow: (canvas: HTMLDivElement) => void,

  mainCanvas?: HTMLCanvasElement,
  setMainCanvas: (canvas: HTMLCanvasElement) => void,

  xAxisCanvas?: HTMLCanvasElement,
  setXAxisCanvas: (canvas: HTMLCanvasElement) => void,

  yAxisCanvas?: HTMLCanvasElement,
  setYAxisCanvas: (canvas: HTMLCanvasElement) => void,
}

export const AnnotatorCanvasContext = createContext<AnnotatorCanvasContext>({
  setWindow: () => {
  },
  setMainCanvas: () => {
  },
  setXAxisCanvas: () => {
  },
  setYAxisCanvas: () => {
  },
})

export const useAnnotatorCanvasContext = () => {
  const context = useContext(AnnotatorCanvasContext);
  if (!context) {
    throw new Error('useAnnotatorCanvas must be used within a AnnotatorCanvasContextProvider');
  }
  return context;
}

export const AnnotatorCanvasContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ window, setWindow ] = useState<HTMLDivElement>();
  const [ mainCanvas, setMainCanvas ] = useState<HTMLCanvasElement>();
  const [ xAxisCanvas, setXAxisCanvas ] = useState<HTMLCanvasElement>();
  const [ yAxisCanvas, setYAxisCanvas ] = useState<HTMLCanvasElement>();

  return <AnnotatorCanvasContext.Provider children={ children }
                                          value={ {
                                            window, setWindow,
                                            mainCanvas, setMainCanvas,
                                            xAxisCanvas, setXAxisCanvas,
                                            yAxisCanvas, setYAxisCanvas,
                                          } }/>;
}
