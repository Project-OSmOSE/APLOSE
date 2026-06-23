import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import './css/base.css';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { StoreProvider } from '@/features/App';
import { useLoadEventService } from '@/features/UX';

import { routeTree } from '@/routeTree.gen';
import { WarningText } from '@/components/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/api/queryClient';
import { Center } from '@/components/layout/Display';
import { Spinner } from '@/components/base/Spinner';


export const router = createRouter({
    basepath: '/app',
    routeTree,
    defaultPreload: 'intent',
    defaultStaleTime: 5_000,
    scrollRestoration: true,
    defaultPendingComponent: () => <Center><Spinner/></Center>,
    defaultErrorComponent: ({ error }) => <Center><WarningText error={ error }/></Center>,
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const App: React.FC = () => {
    useLoadEventService();

    return <QueryClientProvider client={ queryClient }>
        <RouterProvider router={ router }/>
    </QueryClientProvider>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <StoreProvider>
            <App/>
        </StoreProvider>
    </StrictMode>,
)
