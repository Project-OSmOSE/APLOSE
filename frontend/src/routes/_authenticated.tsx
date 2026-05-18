import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate, useRouter } from '@tanstack/react-router'

import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';

import { AploseSkeleton } from '@/components/layout';
import { loadUser } from '@/api';

const Component: React.FC = () => {
    const isConnected = useAppSelector(selectIsConnected);

    const navigate = useNavigate();
    const router = useRouter();
    useEffect(() => {
        if (!isConnected) navigate({
            to: '/login',
            search: { redirect: router.latestLocation.href },
            replace: true,
        });
    }, [ isConnected ]);

    return <AploseSkeleton><Outlet/></AploseSkeleton>
}
export const Route = createFileRoute('/_authenticated')({
    loader: async () => {
        const user = await loadUser()
        if (!user) throw redirect({
            to: '/login',
            search: { redirect: location.href },
            replace: true,
        })
    },
    component: Component,
})
