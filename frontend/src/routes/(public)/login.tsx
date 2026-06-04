import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { IonSpinner } from '@ionic/react';

import { useToast } from '@/components/ui';
import { Input } from '@/components/form';
import { Button, Link } from '@/components/base/Button';
import { getErrorMessage } from '@/service/function';

import { useLogin } from '@/api';

import { User } from '@/features'
import { Auth } from '@/features/Auth';
import styles from './public.module.scss';


const Login: React.FC = () => {

    // State
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ errors, setErrors ] = useState<{ global?: string, username?: string, password?: string }>({});

    // Service
    const navigate = useNavigate();
    const search = Route.useSearch()
    const to = useMemo(() => search?.redirect || '/annotation-campaign', [ search ]);
    const [ login, { isLoading, error: loginError } ] = useLogin();
    const toast = useToast()
    const { refetch: refetchUser } = useQuery(User.API.currentQuery)

    useEffect(() => {
        return () => {
            toast.dismiss()
        }
    }, []);

    useEffect(() => {
        if (loginError) toast.raiseError({ error: loginError });
    }, [ loginError ]);

    const submit = useCallback(async () => {
        setErrors({})
        if (!username) setErrors({ username: 'This field is required.' })
        if (!password) setErrors(prev => ({ ...prev, password: 'This field is required.' }))
        if (!username || !password) return;

        await login({ username, password }).unwrap()
            .then(() => refetchUser())
            .then(() => navigate({ to, replace: true }))
            .catch(error => setErrors({ global: getErrorMessage(error) }));
    }, [ setErrors, username, password, navigate, to, login, refetchUser ])

    return <div className={ styles.loginContent }>
        <h2>Login</h2>

        <Auth.Form.Login/>

        <form className={ styles.inputs }>
            <Input id="loginInput"
                   className="form-control"
                   value={ username }
                   onChange={ (e) => setUsername(e.target.value) }
                   error={ errors.username }
                   placeholder="username" label="Username" autoComplete="username"/>
            <Input id="passwordInput"
                   className="form-control"
                   value={ password }
                   onChange={ e => setPassword(e.target.value) }
                   error={ errors.password }
                   placeholder="password"
                   label="Password"
                   type="password"
                   autoComplete="current-password"/>
        </form>
        <div className={ styles.buttons }>

            <Link to="/">Back to Home</Link>

            { isLoading && <IonSpinner/> }

            <Button color="primary"
                    onClick={ submit }
                    disabled={ isLoading }>
                Login
            </Button>
        </div>
    </div>
}

export const Route = createFileRoute('/(public)/login')({
    validateSearch: (search: Record<string, unknown>) => search as { redirect?: string } | undefined,
    component: Login,
})

