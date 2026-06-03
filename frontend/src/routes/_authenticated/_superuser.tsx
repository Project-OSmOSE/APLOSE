import React, { useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { User } from '@/features';
import { queryClient } from '@/api/queryClient';

const Component: React.FC = () => {
    const { data: user } = useQuery(User.API.currentQuery)

    const navigate = useNavigate();
    useEffect(() => {
        if (!user?.isSuperuser) navigate({ to: '/annotation-campaign' });
    }, [ user ]);

    return <Outlet/>
}
export const Route = createFileRoute('/_authenticated/_superuser')({
    loader: async () => {
        const user = await queryClient.ensureQueryData(User.API.currentQuery)
        if (!user.isSuperuser) throw redirect({ to: '/annotation-campaign' })
    },
    component: Component,
})
