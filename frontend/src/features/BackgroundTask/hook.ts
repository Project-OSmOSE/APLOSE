import { useContext } from 'react';

import { Context } from './Context';

export const use = () => {
    const context = useContext(Context);
    if (!context) {
        throw new Error('BackgroundTask.use must be used within a BackgroundTask.Provider');
    }
    return context;
}
