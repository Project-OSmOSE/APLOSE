import React, { createContext, type ReactNode, useCallback, useContext, useState } from 'react';
import { Dialog } from '../Dialog';
import { Alert } from './Alert';

type AlertContext = {
    openAlert: (alert: Alert<any>) => void;
};

export const AlertContext = createContext<AlertContext>({
    openAlert: () => null,
})

export const useAlertContext = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlertContext must be used within a AlertProvider');
    }
    return context;
}

export const Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [ alert, setAlert ] = useState<Alert<any> | undefined>();
    const [ isOpen, setIsOpen ] = useState(false);

    const openAlert = useCallback((node: Alert<any>) => {
        setAlert(node)
        setIsOpen(true)
    }, [ alert ])

    return (
        <AlertContext.Provider value={ { openAlert } }>
            { children }

            <Dialog.Root open={ isOpen } onOpenChange={ setIsOpen }>
                <Dialog.Portal>
                    { alert && <Alert { ...alert }/> }
                </Dialog.Portal>
            </Dialog.Root>
        </AlertContext.Provider>
    )
}