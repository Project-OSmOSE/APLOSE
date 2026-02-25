import { Fragment, type MouseEvent, type MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import type { ExtendedDivEvent, ExtendedDivPosition } from './types';
import { MOUSE_MOVE_EVENT, MOUSE_UP_EVENT, useEvent } from '@/features/UX';
import styles from './extended.module.scss'

export const useExtendedDiv = ({
                                   divRef,
                                   initialPosition,
                                   onUpdated,
                                   minX,
                                   maxX,
                                   minY,
                                   maxY,
                               }: {
    divRef: MutableRefObject<HTMLDivElement | null>,
    initialPosition: ExtendedDivPosition,
    onUpdated?: (position: ExtendedDivPosition) => void,
    minX?: number,
    maxX?: number,
    minY?: number,
    maxY?: number,
}) => {
    const isEvent = useRef<ExtendedDivEvent | undefined>()
    const startPointer = useRef({ x: 0, y: 0 });
    const startPosition = useRef({ x: 0, y: 0, width: 0, height: 0 });
    const rafId = useRef<number | null>(null); // RAF = Request Animation Frame

    const initPosition = useCallback(() => {
        if (!divRef.current) return;
        if (initialPosition.width !== undefined)
            divRef.current.style.width = `${ initialPosition.width }px`;
        if (initialPosition.height !== undefined)
            divRef.current.style.height = `${ initialPosition.height }px`;
        divRef.current.style.transform = `translate(${ initialPosition.x }px, ${ initialPosition.y }px)`;
    }, [ initialPosition, divRef ])
    useEffect(() => {
        initPosition()
        return () => {
            if (rafId.current) {
                cancelAnimationFrame(rafId.current)
                rafId.current = null
            }
        }
    }, []);

    const getCurrentRect = useCallback((e: MouseEvent) => {
        const dx = e.clientX - startPointer.current.x;
        const dy = e.clientY - startPointer.current.y;
        const newPosition = { ...startPosition.current }
        switch (isEvent.current) {
            case 'drag':
                newPosition.x = startPosition.current.x + dx
                newPosition.y = startPosition.current.y + dy
                break;

            case 'resizeTop':
                newPosition.y = startPosition.current.y + dy
                newPosition.height = startPosition.current.height - dy
                break;
            case 'resizeBottom':
                newPosition.height = startPosition.current.height + dy
                break;
            case 'resizeLeft':
                newPosition.x = startPosition.current.x + dx
                newPosition.width = startPosition.current.width - dx
                break;
            case 'resizeRight':
                newPosition.width = startPosition.current.width + dx
                break;

            case 'resizeTopLeft':
                newPosition.y = startPosition.current.y + dy
                newPosition.height = startPosition.current.height - dy
                newPosition.x = startPosition.current.x + dx
                newPosition.width = startPosition.current.width - dx
                break;
            case 'resizeTopRight':
                newPosition.y = startPosition.current.y + dy
                newPosition.height = startPosition.current.height - dy
                newPosition.width = startPosition.current.width + dx
                break;
            case 'resizeBottomLeft':
                newPosition.height = startPosition.current.height + dy
                newPosition.x = startPosition.current.x + dx
                newPosition.width = startPosition.current.width - dx
                break;
            case 'resizeBottomRight':
                newPosition.height = startPosition.current.height + dy
                newPosition.width = startPosition.current.width + dx
                break;
        }
        if (minX) newPosition.x = Math.max(minX, newPosition.x);
        if (minY) newPosition.y = Math.max(minY, newPosition.y);
        if (maxX) {
            newPosition.x = Math.min(maxX, newPosition.x);
            newPosition.width = Math.min(
                maxX - newPosition.x,
                newPosition.width,
            )
        }
        if (maxY) {
            newPosition.y = Math.min(maxY, newPosition.y);
            newPosition.height = Math.min(
                maxY - newPosition.y,
                newPosition.height,
            )
        }
        return newPosition
    }, [ minX, maxX, minY, maxY ])

    const handleMouseDown = useCallback((e: MouseEvent, type: ExtendedDivEvent) => {
        e.preventDefault(); // Prevents text selection during drag
        e.stopPropagation(); // Prevents dragging if resizing

        isEvent.current = type

        startPointer.current = { x: e.clientX, y: e.clientY };

        // Read current position from the DOM, not from state
        const rect = divRef.current!.getBoundingClientRect();
        const parendRect = divRef.current!.parentElement!.getBoundingClientRect();
        startPosition.current = {
            x: rect.x - parendRect.x,
            y: rect.y - parendRect.y,
            width: rect.width,
            height: rect.height,
        };
    }, [ divRef ]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!isEvent.current) return;
        // Cancel any pending frame before scheduling a new one
        if (rafId.current) cancelAnimationFrame(rafId.current);
        rafId.current = requestAnimationFrame(() => {
            const { x, y, width, height } = getCurrentRect(e)
            if (initialPosition.width !== undefined)
                divRef.current!.style.width = `${ width }px`;
            if (initialPosition.height !== undefined)
                divRef.current!.style.height = `${ height }px`;
            divRef.current!.style.transform = `translate(${ x }px, ${ y }px)`;
        });
    }, [ getCurrentRect, initialPosition, divRef ]);
    useEvent(MOUSE_MOVE_EVENT, handleMouseMove)

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (!isEvent.current) return
        isEvent.current = undefined;

        if (rafId.current) {
            cancelAnimationFrame(rafId.current);
            rafId.current = null;
        }

        if (onUpdated) onUpdated(getCurrentRect(e))
    }, [ onUpdated, getCurrentRect ]);
    useEvent(MOUSE_UP_EVENT, handleMouseUp)

    return useMemo(() => ({
        initPosition,
        handleMouseDown,
        className: styles.updatable,
        handles: <Fragment>
            <div className={ [ styles.handle, styles.top ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeTop') }/>
            <div className={ [ styles.handle, styles.bottom ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeBottom') }/>
            <div className={ [ styles.handle, styles.left ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeLeft') }/>
            <div className={ [ styles.handle, styles.right ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeRight') }/>

            <div className={ [ styles.handle, styles.topLeft ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeTopLeft') }/>
            <div className={ [ styles.handle, styles.topRight ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeTopRight') }/>
            <div className={ [ styles.handle, styles.bottomLeft ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeBottomLeft') }/>
            <div className={ [ styles.handle, styles.bottomRight ].join(' ') }
                 onMouseDown={ e => handleMouseDown(e, 'resizeBottomRight') }/>
        </Fragment>,
    }), [ initPosition, handleMouseDown ])
}