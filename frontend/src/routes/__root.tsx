import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactFlowProvider } from '@xyflow/react';
import { AlertProvider, Link } from '@/components/ui';
import { AudioProvider } from '@/features/Audio';
import { Footer, Header } from '@/components/layout';
import React, { Fragment, useMemo } from 'react';

import styles from './index.module.scss';
import { useCurrentUser } from '@/api';

const NotFound: React.FC = () => {
    const { user } = useCurrentUser()

    return useMemo(() =>
            <div className={ styles.page } style={ { gridTemplateRows: 'auto 1fr auto', minHeight: '100vh' } }>
                <Header buttons={ <Fragment>
                    <Link size="large" to={ user ? '/annotation-campaign' : '/login' }>
                        { user ? 'APLOSE' : 'Login' }
                    </Link>
                    <Link href="/" size="large">OSmOSE</Link>
                </Fragment>
                }/>
                <div className={ styles.content }>

                    Page not found

                </div>
                <Footer/>
            </div>,
        [ user ],
    )
}

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
    notFoundComponent: NotFound,
})
