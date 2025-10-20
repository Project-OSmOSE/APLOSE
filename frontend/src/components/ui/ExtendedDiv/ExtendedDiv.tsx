import React, { HTMLProps, MouseEvent, ReactNode } from 'react';
import { DraggableDiv } from './DraggableDiv';
import { ResizableDiv } from './ResizableDiv';
import style from './extended.module.scss';

export const ExtendedDiv: React.FC<{
  top?: number;
  left?: number;
  height?: number;
  width?: number;
  onTopMove?(value: number): void;
  onLeftMove?(value: number): void;
  onWidthMove?(value: number): void;
  onHeightMove?(value: number): void;
  onUp?(): void;
  draggable?: boolean;
  resizable?: boolean;
  verticalResizable?: boolean;
  horizontalResizable?: boolean;
  children?: ReactNode;
  className?: string;
  innerClassName?: string;
  onClick?: () => void;
  onInnerMouseDown?: (event: MouseEvent) => void;
} & HTMLProps<HTMLDivElement>> = ({
                                    draggable = false,
                                    children,
                                    onTopMove, onLeftMove,
                                    onWidthMove, onHeightMove,
                                    onUp,
                                    top, height, left, width,
                                    verticalResizable,
                                    horizontalResizable,
                                    resizable,
                                    className, innerClassName,
                                    onClick,
                                    onInnerMouseDown,
                                    ...props
                                  }) => {
  return (
    <ResizableDiv { ...props }
                  onLeftMove={ onLeftMove } onTopMove={ onTopMove }
                  onWidthMove={ onWidthMove } onHeightMove={ onHeightMove }
                  top={ top } height={ height }
                  left={ left } width={ width }
                  horizontalResize={ horizontalResizable }
                  verticalResize={ verticalResizable }
                  resizable={ resizable }
                  className={ className }
                  onUp={ onUp }
                  onClick={ onClick }>
      <DraggableDiv onXMove={ onLeftMove } onYMove={ onTopMove } onUp={ onUp }
                    onMouseDown={ onInnerMouseDown }
                    draggable={ draggable } className={ [ style.fill, innerClassName ].join(' ') }>
        { children }
      </DraggableDiv>
    </ResizableDiv>
  )
}
