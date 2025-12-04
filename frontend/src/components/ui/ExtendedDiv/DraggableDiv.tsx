import React, { MouseEvent, ReactNode, useCallback, useEffect, useRef } from 'react';
import { MOUSE_MOVE_EVENT, MOUSE_UP_EVENT } from '@/features/UX/Events';
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
  const div = useRef<HTMLDivElement | null>(null);

  const mouseMove = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (onXMove) onXMove(event.movementX);
    if (onYMove) onYMove(event.movementY);
  }, [ onXMove, onYMove ])

  const mouseUp = useCallback(() => {
    if (onUp && draggable) onUp()
    MOUSE_MOVE_EVENT.remove(mouseMove)
    MOUSE_UP_EVENT.remove(mouseUp)
  }, [ onUp, draggable, mouseMove ])

  const mouseDown = useCallback((event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    if (draggable) {
      MOUSE_MOVE_EVENT.add(mouseMove)
      MOUSE_UP_EVENT.add(mouseUp)
    }

    if (!onMouseDown) return;
    if ((event.target as any)?.className == div.current?.className) onMouseDown(event);
  }, [ mouseMove, draggable, mouseUp, onMouseDown ])

  useEffect(() => {
    return () => {
      MOUSE_MOVE_EVENT.remove(mouseMove)
      MOUSE_UP_EVENT.remove(mouseUp)
    }
  }, []);

  return (
    <div ref={ div }
         onMouseDown={ mouseDown }
         children={ children }
         className={ [ draggable ? style.draggable : '', className ].join(' ') }/>
  )
}