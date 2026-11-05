import React, { useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { type BaseUIEvent, Button, ButtonGroup, Field, Fieldset, Form, Spinner, Toast } from '@/components/base';
import * as API from '../api';

export const EmailForm: React.FC<{ id?: string }> = ({ id }) => {
    const { data: user } = useQuery(API.currentQuery)
    const toastManager = Toast.useToastManager()
    const {
        mutate,
        isPending,
        data,
    } = useMutation(API.updateEmailMutation)

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        try {
            await mutate({ email })
        } catch (error) {
            toastManager.addError({ title: 'Email update failed', error })
        }
    }, [ mutate, toastManager ])

    return <Form id={ id }
                 onSubmit={ submit }
                 gqlErrors={ data?.errors }>
        <Fieldset.Root>
            <Fieldset.Legend>Update email</Fieldset.Legend>

            <Field.Root name="email">
                <Field.Label>Email</Field.Label>
                <Field.Control required
                               placeholder={ user?.email }
                               type="email"
                               autoComplete="email"/>
                <Field.Error/>
            </Field.Root>

            <ButtonGroup end>
                { isPending && <Spinner/> }
                <Button color="primary" type="submit" disabled={ isPending }>
                    Update
                </Button>
            </ButtonGroup>
        </Fieldset.Root>
    </Form>
}
