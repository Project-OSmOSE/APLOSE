import React, { useCallback, useMemo } from 'react';
import { Form } from '@/components/base/Form';
import { Fieldset } from '@/components/base/Fieldset';
import { Field } from '@/components/base/Field';
import { Button, ButtonGroup, Link } from '@/components/base/Button';
import { AuthRestAPI } from '@/api';
import type { BaseUIEvent } from '@base-ui/react';
import { useNavigate } from '@tanstack/react-router';

export const Login: React.FC = () => {
    const [ mutate, { isLoading } ] = AuthRestAPI.endpoints.login.useMutation()
    const navigate = useNavigate();

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        await mutate({ username, password})
    }, [ mutate, navigate ])

    return useMemo(() => <Form onSubmit={ submit }>
            <Fieldset.Root>
                <Field.Root name="username">
                    <Field.Label>Username</Field.Label>
                    <Field.Control required
                                   type="text"
                                   autoComplete="username"/>
                    <Field.Error/>
                </Field.Root>

                <Field.Root name="password">
                    <Field.Label>Password</Field.Label>
                    <Field.PasswordControl required
                                           autoComplete="password"/>
                    <Field.Error/>
                </Field.Root>
            </Fieldset.Root>

            <ButtonGroup spaceBetween>
                <Link to="/">Back to home</Link>
                <Button color="primary" type="submit" disabled={ isLoading }>
                    Login
                </Button>
            </ButtonGroup>
        </Form>,
        [ isLoading, submit ])
}
