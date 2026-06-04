import React from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { Auth } from '@/features/Auth';
import styles from './public.module.scss';


const Login: React.FC = () => {
    return <div className={ styles.loginContent }>
        <h2>Login</h2>

        <Auth.Form.Login/>
    </div>
}

export const Route = createFileRoute('/(public)/login')({
    validateSearch: (search: Record<string, unknown>) => search as { redirect?: string } | undefined,
    component: Login,
})

