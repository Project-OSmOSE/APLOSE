import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'

import { useCurrentUser } from '@/api';

const Component: React.FC = () => {
    const { user } = useCurrentUser()

    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.isSuperuser) navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Outlet/>
}
export const Route = createFileRoute('/_authenticated/_superuser')({
    beforeLoad: ({ context }) => {
        if (!context.isSuperuser) {
            throw redirect({ to: '/annotation-campaign' })
        }
    },
    component: Component,
})
