import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactFlowProvider } from '@xyflow/react';
import { AlertProvider } from '@/components/ui';
import { AudioProvider } from '@/features/Audio';

type RouterContext = {
    isConnected: boolean;
    isAdmin?: boolean;
    isSuperuser?: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () =>
        <AudioProvider>
            <AlertProvider>
                <ReactFlowProvider>
                    <Outlet/>
                    <TanStackRouterDevtools/>
                </ReactFlowProvider>
            </AlertProvider>
        </AudioProvider>,
})
