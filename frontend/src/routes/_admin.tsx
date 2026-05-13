import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'

import { useCurrentUser } from '@/api';

const Component: React.FC = () => {
    const { user } = useCurrentUser()

    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.isAdmin) navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Outlet/>
}
export const Route = createFileRoute('/_admin')({
    beforeLoad: ({ context }) => {
        if (!context.isAdmin) {
            throw redirect({ to: '/annotation-campaign' })
        }
    },
    component: Component,
})
