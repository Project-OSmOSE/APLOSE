import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Footer, PublicHeader } from '@/components/layout';
import { IonNote } from '@ionic/react';

import styles from './public.module.scss';

export const Route = createFileRoute('/(public)')({
    component: () => (
        <div className={ styles.page }>
            <PublicHeader/>
            <Outlet/>
            <Footer/>
        </div>
    ),
    notFoundComponent: () =>
        <div className={ styles.page }>
            <PublicHeader/>
            <IonNote>Page not found</IonNote>
            <Footer/>
        </div>,
})
