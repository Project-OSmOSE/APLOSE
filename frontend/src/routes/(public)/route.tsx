import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Note } from '@/components/base/Note';
import { Spinner } from '@/components/base/Spinner';
import { Page } from '@/components/layout';

export const Route = createFileRoute('/(public)')({
    component: () => <Page.Public children={ <Outlet/> }/>,
    notFoundComponent: () => <Page.Public><Note color='warning'>Page not found</Note></Page.Public>,
    pendingComponent: () => <Page.Public><Spinner/></Page.Public>,
})
