import React, { type ReactNode } from 'react';
import { Tooltip } from './Tooltip';
import { Toast } from './Toast';


export const BaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Tooltip.Provider>
        <Toast.Provider>
            { children }
        </Toast.Provider>
    </Tooltip.Provider>
)