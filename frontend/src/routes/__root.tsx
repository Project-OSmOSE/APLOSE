import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactFlowProvider } from '@xyflow/react';
import { AlertProvider } from '@/components/ui';
import { AudioProvider } from '@/features/Audio';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BaseProvider } from '@/components/base/Provider';


export const Route = createRootRouteWithContext()({
    component: () =>
        <BaseProvider>
            <AudioProvider>
                <AlertProvider>
                    <ReactFlowProvider>
                        <Outlet/>

                        {/* Dev tools */ }
                        <TanStackRouterDevtools position="bottom-right"/>
                        <ReactQueryDevtools initialIsOpen={ false } position="right"/>
                    </ReactFlowProvider>
                </AlertProvider>
            </AudioProvider>
        </BaseProvider>,
})
