import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useRouter } from '@tanstack/react-router'

import { useCurrentUser } from '@/api';

const Component: React.FC = () => {
    const { user } = useCurrentUser()

    const router = useRouter();
    useEffect(() => {
        if (!user?.isSuperuser) router.navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Outlet/>
}
export const Route = createFileRoute('/_superuser')({
    beforeLoad: ({ context }) => {
        if (!context.isSuperuser) {
            throw redirect({ to: '/annotation-campaign' })
        }
    },
    component: Component,
})
