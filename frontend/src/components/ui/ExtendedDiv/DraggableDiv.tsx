import React, { MouseEvent, ReactNode, useCallback, useRef, useState } from 'react';
import { MOUSE_MOVE_EVENT, MOUSE_UP_EVENT, useEvent } from '@/features/UX/Events';
import style from './extended.module.scss';

export const DraggableDiv: React.FC<{
  onXMove?(movement: number): void;
  onYMove?(movement: number): void;
  onUp?(): void;
  children?: ReactNode;
  draggable?: boolean;
  className?: string;
  onMouseDown?: (event: MouseEvent) => void;
}> = ({
        draggable,
        onXMove, onYMove, onUp,
        children, className,
        onMouseDown,
      }) => {
  const [ isMoveEventActive, setIsMoveEventActive ] = useState<boolean>(false);
  const [ isUpEventActive, setIsUpEventActive ] = useState<boolean>(false);

  const div = useRef<HTMLDivElement | null>(null);

  const mouseMove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (!isMoveEventActive) return;
    if (onXMove) onXMove(event.movementX);
    if (onYMove) onYMove(event.movementY);
  }, [ onXMove, onYMove, isMoveEventActive ])
  useEvent(MOUSE_MOVE_EVENT, mouseMove)

  const mouseUp = useCallback(() => {
    if (!isUpEventActive) return;
    if (onUp && draggable) onUp()
    setIsMoveEventActive(false)
    setIsUpEventActive(false)
  }, [ onUp, draggable, mouseMove, isUpEventActive ])
  useEvent(MOUSE_UP_EVENT, mouseUp)

  const mouseDown = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (draggable) {
      setIsMoveEventActive(true)
      setIsUpEventActive(true)
    }

    if (!onMouseDown) return;
    if ((event.target as any)?.className == div.current?.className) onMouseDown(event);
  }, [ mouseMove, draggable, mouseUp, onMouseDown ])

  return (
    <div ref={ div }
         onMouseDown={ mouseDown }
         children={ children }
         className={ [ draggable ? style.draggable : '', className ].join(' ') }/>
  )
}