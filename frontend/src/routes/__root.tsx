import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactFlowProvider } from '@xyflow/react';
import { AlertProvider } from '@/components/ui';
import { AudioProvider } from '@/features/Audio';
import styles from '@/routes/(public)/public.module.scss';
import { Footer, PublicHeader } from '@/components/layout';
import { IonNote } from '@ionic/react';


export const Route = createRootRouteWithContext()({
    component: () =>
        <AudioProvider>
            <AlertProvider>
                <ReactFlowProvider>
                    <Outlet/>
                    <TanStackRouterDevtools/>
                </ReactFlowProvider>
            </AlertProvider>
        </AudioProvider>,

    notFoundComponent: () =>
        <div className={ styles.notFoundPage }>
            <PublicHeader/>
            <IonNote>Page not found</IonNote>
            <Footer/>
        </div>,
})
