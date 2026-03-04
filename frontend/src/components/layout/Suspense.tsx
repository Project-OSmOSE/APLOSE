import React, { type ReactNode, Suspense, useMemo } from 'react';
import { useCurrentUser } from '@/api';
import { IonSpinner } from '@ionic/react';
import { Navigate } from 'react-router-dom';

export const SuspenseAdminOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isLoading, isUninitialized, user } = useCurrentUser()

    return useMemo(() => {
        if (isUninitialized || isLoading) return <IonSpinner/>
        if (user?.isAdmin) return <Suspense children={ children }/>
        return <Navigate to="/annotation-campaign" replace/>
    }, [ isUninitialized, isLoading, user, children ])
}

export const SuspenseSuperUserOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isLoading, isUninitialized, user } = useCurrentUser()

    return useMemo(() => {
        if (isUninitialized || isLoading) return <IonSpinner/>
        if (user?.isSuperuser) return <Suspense children={ children }/>
        return <Navigate to="/annotation-campaign" replace/>
    }, [ isUninitialized, isLoading, user, children ])
}
