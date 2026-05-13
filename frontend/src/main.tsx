import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { IonApp, setupIonicReact } from '@ionic/react';
import { createRouter, RouterProvider } from '@tanstack/react-router';
import { ReactFlowProvider } from '@xyflow/react';

import { AlertProvider } from '@/components/ui';

import { useCurrentUser } from '@/api';

import { StoreProvider, useAppSelector } from '@/features/App';
import { AudioProvider } from '@/features/Audio';
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
      <StoreProvider>
          <IonApp>
              <AudioProvider>
                  <AlertProvider>
                      <ReactFlowProvider>
                          <App/>
                      </ReactFlowProvider>
                  </AlertProvider>
              </AudioProvider>
          </IonApp>
      </StoreProvider>
  </StrictMode>
)
