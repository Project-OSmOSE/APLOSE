import React, { useEffect } from 'react';
import { createFileRoute, Outlet, useNavigate, useRouter , redirect} from '@tanstack/react-router'

import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';

import { AploseSkeleton } from '@/components/layout';

const Component: React.FC = () => {
    const isConnected = useAppSelector(selectIsConnected);

    const navigate = useNavigate();
    const router = useRouter();
    useEffect(() => {
        if (!isConnected) navigate({
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
