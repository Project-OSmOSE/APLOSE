import React, { useCallback, useEffect } from 'react';
import { createFileRoute, Outlet, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';

import { Page } from '@/components/layout';
import { Toast } from '@/components/base/Toast';

import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';

import { UserAPI } from '@/features/User';
import { Spinner } from '@/components/base/Spinner';
import { WarningText } from '@/components/ui';
import { Center } from '@/components/layout/Display';

const Component: React.FC = () => {
    const { status, error, isFetching, data: user } = useQuery(UserAPI.currentQuery)

    const navigate = useNavigate();
    const router = useRouter();
    const toastManager = Toast.useToastManager()

    const handleNotConnected = useCallback(async () => {
        await queryClient.invalidateQueries({ queryKey: queryKeys.user.current })
        navigate({
            to: '/login',
            search: { redirect: router.latestLocation.pathname.replace('/app', '') },
            replace: true,
        });
        if (error) toastManager.addError({ title: 'Fail getting current user', error });
    }, [ router, toastManager, navigate, error ])

    useEffect(() => {
        if (!isFetching && (status === 'error' || !user)) handleNotConnected()
    }, [ status, user ]);

    return <Page.Authenticated><Outlet/></Page.Authenticated>
}
export const Route = createFileRoute('/_authenticated')({
    loader: async () => {
        const user = await queryClient.ensureQueryData(UserAPI.currentQuery)
        if (user) return { user }
        throw redirect({
            to: '/login',
            search: { redirect: location.pathname.replace('/app', '') },
            replace: true,
        })
    },
    component: Component,
    errorComponent: (error) => <Page.Authenticated>
        <Center><WarningText error={ error }/></Center>
    </Page.Authenticated>,
    pendingComponent: () => <Page.Authenticated>
        <Center><Spinner/></Center>
    </Page.Authenticated>,
})
