import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { IonButton } from '@ionic/react';

import { Button, Link, useToast } from '@/components/ui';
import { Footer, Header } from '@/components/layout';
import { Input } from '@/components/form';
import { getErrorMessage } from '@/service/function';

import { useLogin } from '@/api';

import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';
import { NON_FILTERED_KEY_DOWN_EVENT, useEvent } from '@/features/UX';

import styles from './login.module.scss';


export const Login: React.FC = () => {

    // State
    const isConnected = useAppSelector(selectIsConnected)
    const [ username, setUsername ] = useState<string>('');
    const [ password, setPassword ] = useState<string>('');
    const [ errors, setErrors ] = useState<{ global?: string, username?: string, password?: string }>({});

    // Service
    const router = useRouter();
    const { redirect } = Route.useSearch()
    const to = useMemo(() => redirect || '/annotation-campaign', [ redirect ]);
    const [ login, { isLoading, error: loginError } ] = useLogin();
    const toast = useToast()

    useEffect(() => {
        return () => {
            toast.dismiss()
        }
    }, []);

    useEffect(() => {
        if (loginError) toast.raiseError({ error: loginError });
    }, [ loginError ]);

    useEffect(() => {
        if (isConnected) router.navigate({ to, replace: true });
    }, [ isConnected ]);

    const submit = useCallback(async () => {
        setErrors({})
        if (!username) setErrors({ username: 'This field is required.' })
        if (!password) setErrors(prev => ({ ...prev, password: 'This field is required.' }))
        if (!username || !password) return;

        await login({ username, password }).unwrap()
            .then(() => router.navigate({ to, replace: true }))
            .catch(error => setErrors({ global: getErrorMessage(error) }));
    }, [ setErrors, username, password, router, to, login ])

    const goHome = useCallback(() => {
        router.navigate({ to: '/' });
    }, [ router ])

    const onKbdEvent = useCallback((event: KeyboardEvent) => {
        switch (event.code) {
            case 'Enter':
            case 'NumpadEnter':
                submit();
                break;
        }
    }, [ submit ])
    useEvent(NON_FILTERED_KEY_DOWN_EVENT, onKbdEvent);

    return <div className={ styles.page }>
        <Header buttons={ <Fragment>
            <Button color="dark" size="large" fill="clear" onClick={ goHome }>Home</Button>
            <Link href="/" size="large">OSmOSE</Link>
        </Fragment> }/>
        <div className={ styles.content }>
            <h2>Login</h2>

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

                <Button color="dark" fill="clear" onClick={ goHome }>Back to Home</Button>

                <IonButton color="primary" onClick={ submit }
                           disabled={ isLoading }>
                    Login
                </IonButton>
            </div>
        </div>
        <Footer/>
    </div>
}

export const Route = createFileRoute('/login')({
    validateSearch: (search: Record<string, unknown>) => ({
        redirect: search['redirect'] as string,
    }),
    component: Login,
})

