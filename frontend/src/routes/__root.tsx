import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

type RouterContext = {
    isConnected: boolean;
    isAdmin?: boolean;
    isSuperuser?: boolean;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => <>
        <Outlet/>
        <TanStackRouterDevtools/>
    </>,
})
