import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { UserAPI } from '@/features/User';

const Component: React.FC = () => {
    const { data: user } = useQuery(UserAPI.currentQuery)

    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.isSuperuser) navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Outlet/>
}
export const Route = createFileRoute('/_authenticated/_superuser')({
    loader: async ({ parentMatchPromise }) => {
        const { loaderData } = await parentMatchPromise
        if (!loaderData?.user?.isSuperuser) throw redirect({ to: '/annotation-campaign' })
        return { ...loaderData }
    },
    component: Component,
})
