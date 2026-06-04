import React, { useCallback, useMemo } from 'react';
import { Form } from '@/components/base/Form';
import { Fieldset } from '@/components/base/Fieldset';
import { Field } from '@/components/base/Field';
import { Button, ButtonGroup, Link } from '@/components/base/Button';
import { AuthRestAPI } from '@/api';
import type { BaseUIEvent } from '@base-ui/react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { Route } from '@/routes/(public)/login';
import { User } from '@/features';
import { useToast } from '@/components/ui';
import { IonSpinner } from '@ionic/react';

export const Login: React.FC = () => {
    const [ mutate, { isLoading: isLoginIn } ] = AuthRestAPI.endpoints.login.useMutation()
    const { refetch: refetchUser, isRefetching } = useQuery(User.API.currentQuery)

    const isLoading = useMemo(() => isLoginIn || isRefetching, [ isLoginIn, isRefetching ])

    const search = Route.useSearch()
    const to = useMemo(() => search?.redirect || '/annotation-campaign', [ search ]);
    const navigate = useNavigate();

    const toast = useToast()

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            await mutate({ username, password }).unwrap()
            await refetchUser()
            await navigate({ to, replace: true })
        } catch (error) {
            toast.raiseError({ error })
        }
    }, [ mutate, refetchUser, navigate, to, toast ])

    return useMemo(() => <Form onSubmit={ submit }>
            <Fieldset.Root>
                <Field.Root name="username">
                    <Field.Label>Username</Field.Label>
                    <Field.Control required
                                   type="text"
                                   autoComplete="username"/>
                </Field.Root>

                <Field.Root name="password">
                    <Field.Label>Password</Field.Label>
                    <Field.PasswordControl required
                                           autoComplete="password"/>
                </Field.Root>
            </Fieldset.Root>

            <ButtonGroup spaceBetween>
                <Link to="/">Back to home</Link>
                { isLoading && <IonSpinner/> }
                <Button color="primary" type="submit" disabled={ isLoading }>
                    Login
                </Button>
            </ButtonGroup>
        </Form>,
        [ isLoading, submit ])
}
