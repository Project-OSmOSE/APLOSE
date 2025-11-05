import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { Alert as AlertType } from './type';
import { Alert } from './Alert';
import { useAppDispatch } from '@/features/App';
import { EventSlice } from '@/features/UX/Events';

// Based on https://medium.com/@mayankvishwakarma.dev/building-an-alert-provider-in-react-using-context-and-custom-hooks-7c90931de088

type AlertContext = {
  showAlert: (alert: AlertType) => void;
  hideAlert: () => void;
};

type AlertContextProvider = {
  children: ReactNode;
};

export const AlertContext = createContext<AlertContext>({
  showAlert: () => -1,
  hideAlert: () => {
  },
})

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within a AlertProvider');
  }
  return context;
}

export const AlertProvider: React.FC<AlertContextProvider> = ({ children }) => {
  const [ alert, setAlert ] = useState<AlertType | undefined>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (alert) {
      dispatch(EventSlice.actions.disableShortcuts())
    } else {
      dispatch(EventSlice.actions.enableShortcuts())
    }
  }, [ alert ]);

  // Context value containing the showAlert function
  const contextValue: AlertContext = useMemo(() => ({
    showAlert: setAlert,
    hideAlert: () => setAlert(undefined),
  }), [ setAlert ]);

  return (
    <AlertContext.Provider value={ contextValue }>
      { children }

      { alert && <Alert alert={ alert } hide={ () => setAlert(undefined) }/> }
    </AlertContext.Provider>
  )
}