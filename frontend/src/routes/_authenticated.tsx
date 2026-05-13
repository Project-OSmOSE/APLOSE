import React, { useEffect } from 'react';
import { createFileRoute, Outlet, useRouter , redirect} from '@tanstack/react-router'

import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';

import { AploseSkeleton } from '@/components/layout';

const Component: React.FC = () => {
    const isConnected = useAppSelector(selectIsConnected);

    const router = useRouter();
    useEffect(() => {
        if (!isConnected) router.navigate({
            to: '/login',
            search: { redirect: router.latestLocation.href },
        });
    }, [ isConnected ]);

    return <AploseSkeleton><Outlet/></AploseSkeleton>
}
export const Route = createFileRoute('/_authenticated')({
    beforeLoad: ({ context, location }) => {
        if (!context.isConnected) {
            throw redirect({
                to: '/login',
                search: { redirect: location.href },
            })
        }
    },
    component: Component,
})
