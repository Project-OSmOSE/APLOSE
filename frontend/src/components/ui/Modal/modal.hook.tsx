import React, { createElement, Fragment, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = { onClose: () => void };

export const useModal = (component: React.FC<ModalProps>) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const toggle = useCallback(() => setIsOpen(prev => !prev), [ setIsOpen ])
    const open = useCallback(() => setIsOpen(true), [ setIsOpen ])
    const close = useCallback(() => setIsOpen(false), [ setIsOpen ])

    return useMemo(() => ({
        isOpen,
        toggle,
        open,
        close,
        element: isOpen ? createPortal(createElement(component, { onClose: close }), document.body) : <Fragment/>,
    }), [ isOpen, toggle, open, close, component ]);
}
