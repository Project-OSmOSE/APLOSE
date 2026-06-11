import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { User } from '@/features';

const Component: React.FC = () => {
    const { data: user } = useQuery(User.API.currentQuery)

    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.isAdmin) navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Outlet/>
}
export const Route = createFileRoute('/_authenticated/_admin')({
    loader: async ({parentMatchPromise}) => {
        const { user } = (await parentMatchPromise).loaderData!
        if (!user.isAdmin) throw redirect({ to: '/annotation-campaign' })
        return { user }
    },
    component: Component,
})
