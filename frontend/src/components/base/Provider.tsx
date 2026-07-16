import React, { type ReactNode } from 'react';
import { CreateDialog } from './CreateDialog';
import { Toast } from './Toast';
import { Alert } from './Alert';


export const BaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Toast.Provider>
        <Alert.Provider>
            <CreateDialog.Provider>
                { children }
            </CreateDialog.Provider>
        </Alert.Provider>
    </Toast.Provider>
)