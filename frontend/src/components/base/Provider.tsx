import React, { type ReactNode } from 'react';
import { Toast } from './Toast';
import { Alert } from './Alert';


export const BaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Alert.Provider>
        <Toast.Provider>
            { children }
        </Toast.Provider>
    </Alert.Provider>
)