import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '@/features/User';
import { queryClient } from '@/api/queryClient';
import { Page } from '@/components/layout';

const Component: React.FC = () => {
    const { data: user } = useQuery(UserAPI.currentQuery)

    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.isAdmin) navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Page.Authenticated><Outlet/></Page.Authenticated>
}
export const Route = createFileRoute('/_authenticated/_admin')({
    loader: async () => {
        const user = await queryClient.ensureQueryData(UserAPI.currentQuery)
        if (!user?.isAdmin) throw redirect({ to: '/annotation-campaign' })
    },
    component: Component,
})
