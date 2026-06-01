import React, { useCallback, useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { AploseSkeleton } from '@/components/layout';
import { useToast } from '@/components/ui';

import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';

import { User } from '@/features';

const Component: React.FC = () => {
    const { status, error, isFetching } = useQuery(User.API.currentQuery)

    const navigate = useNavigate();
    const router = useRouter();
    const toast = useToast()

    const handleNotConnected = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.user.current })
        navigate({
            to: '/login',
            search: { redirect: router.latestLocation.pathname.replace('/app', '') },
            replace: true,
        });
        if (error) toast.raiseError(error);

    }, [ router, toast, navigate, error ])

    useEffect(() => {
        if (!isFetching && status === 'error') handleNotConnected()
    }, [ status ]);

    return <AploseSkeleton><Outlet/></AploseSkeleton>
}
export const Route = createFileRoute('/_authenticated')({
    loader: async () => {
        try {
            const user = await queryClient.ensureQueryData(User.API.currentQuery)
            if (user) return { user }
        } catch (e) {
            if (![ 'Unauthorized', 'Authentication failed' ].includes((e as Error).message)) throw e
        }
        throw redirect({
            to: '/login',
            search: { redirect: location.pathname.replace('/app', '') },
            replace: true,
        })
    },
    component: Component,
})
