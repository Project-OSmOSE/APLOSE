import React, { type ReactNode } from 'react';
import { Toast } from './Toast';


export const BaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Toast.Provider>
        { children }
    </Toast.Provider>
)