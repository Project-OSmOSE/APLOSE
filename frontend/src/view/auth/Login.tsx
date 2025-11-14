import React, { Fragment, useCallback, useEffect, useState } from 'react';
import styles from './auth.module.scss';
import { Footer, Header } from '@/components/layout';
import { Input } from '@/components/form';
import { IonButton } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getErrorMessage } from '@/service/function';
import { Button, Link, useToast } from '@/components/ui';
import { NON_FILTERED_KEY_DOWN_EVENT, useEvent } from '@/features/UX/Events';
import { useAppSelector } from '@/features/App';
import { selectIsConnected } from '@/features/Auth';
import { useLogin } from '@/api';

export const Login: React.FC = () => {

  // State
  const isConnected = useAppSelector(selectIsConnected)
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');
  const [ errors, setErrors ] = useState<{ global?: string, username?: string, password?: string }>({});

  // Service
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: '/annotation-campaign' } };
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
    if (isConnected) navigate(from, { replace: true });
  }, [ isConnected ]);

  const submit = useCallback(async () => {
    setErrors({})
    if (!username) setErrors({ username: 'This field is required.' })
    if (!password) setErrors(prev => ({ ...prev, password: 'This field is required.' }))
    if (!username || !password) return;

    await login({ username, password }).unwrap()
      .then(() => navigate(from, { replace: true }))
      .catch(error => setErrors({ global: getErrorMessage(error) }));
  }, [ setErrors, username, password ])

  const goHome = useCallback(() => {
    navigate('/');
  }, [])

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

export default Login
