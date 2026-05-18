import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import './css/bootstrap-4.1.3.min.css';
import '@ionic/react/css/core.css';
import './css/ionic-override.css';
import './css/annotation-colors.css';
import './css/app.css';

import { IonApp, setupIonicReact } from '@ionic/react';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import { useCurrentUser } from '@/api';

import { StoreProvider, useAppSelector } from '@/features/App';
import { useLoadEventService } from '@/features/UX';
import { selectIsConnected } from '@/features/Auth';

import { routeTree } from '@/routeTree.gen';

setupIonicReact({
    mode: 'md',
    spinner: 'crescent',
});

const router = createRouter({
    basepath: '/app',
    routeTree,
    defaultPreload: 'intent',
    defaultStaleTime: 5_000,
    scrollRestoration: true,
    context: {
        isConnected: undefined!,
        isAdmin: undefined!,
        isSuperuser: undefined!,
    },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const App: React.FC = () => {
    useLoadEventService();

    const isConnected = useAppSelector(selectIsConnected)
    const { user } = useCurrentUser()

    return <RouterProvider router={ router } context={ {
        isConnected,
        isAdmin: user?.isAdmin,
        isSuperuser: user?.isSuperuser,
    } }/>

    // return (
    //     <Routes>
    //
    //         {/*{ isConnected && <Route element={ <Suspense><AploseSkeleton/></Suspense> }>*/ }
    //
    //         <Route path="" element={ <Navigate to="/annotation-campaign" replace/> }/>
    //         {/*</Route> }*/ }
    //
    //         { isConnected ?
    //             <Route path="*" element={ <Navigate to="/annotation-campaign" replace/> }/> :
    //             <Route path="*" element={ <Navigate to="/login" replace state={ { from } }/> }/> }
    //     </Routes>
    // )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <IonApp>
            <StoreProvider>
                <App/>
            </StoreProvider>
        </IonApp>
    </StrictMode>,
)
