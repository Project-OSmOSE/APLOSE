import React, { createElement, Fragment, useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

export type ModalProps = { onClose: () => void };

export const useModal = (component: React.FC<ModalProps & any>, extraArgs?: object) => {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);
    const toggle = useCallback(() => {
        console.log('toggle', component.name)
        setIsOpen(prev => !prev)
    }, [ setIsOpen, component ])
    const open = useCallback(() => {
        console.log('open', component.name)
        setIsOpen(true)
    }, [ setIsOpen , component])
    const close = useCallback(() => {
        console.log('close', component.name)
        setIsOpen(false)
    }, [ setIsOpen, component ])

    return useMemo(() => {
        return {
            isOpen,
            toggle,
            open,
            close,
            element: isOpen ? createPortal(createElement(component, { onClose: close, ...(extraArgs ?? {}) }), document.body) :
                <Fragment/>,
        }
    }, [ isOpen, toggle, open, close, component, extraArgs ]);
}
