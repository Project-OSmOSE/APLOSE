import React, { useCallback, useMemo } from 'react';
import { Form } from '@/components/base/Form';
import { Fieldset } from '@/components/base/Fieldset';
import { Field } from '@/components/base/Field';
import { Button, ButtonGroup } from '@/components/base/Button';
import type { BaseUIEvent } from '@base-ui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui';
import { IonSpinner } from '@ionic/react';
import * as API from '../api';
import { updateEmailMutation } from '../api';

export const Email: React.FC = () => {
    const { data: user } = useQuery(API.currentQuery)
    const toast = useToast();
    const {
        mutate,
        isPending,
        data,
    } = useMutation(updateEmailMutation)

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        try {
            await mutate({ email })
        } catch (error) {
            toast.raiseError({ error })
        }
    }, [ mutate, toast ])

    const errors = useMemo(() =>
            data?.currentUserUpdate?.errors.reduce((prev, current) => ({
                ...prev,
                [current.field]: current.messages,
            }), {})
        , [ data ])

    return useMemo(() => <Form onSubmit={ submit }
                               errors={ errors }>
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
                    { isPending && <IonSpinner/> }
                    <Button color="primary" type="submit" disabled={ isPending }>
                        Update
                    </Button>
                </ButtonGroup>
            </Fieldset.Root>
        </Form>,
        [ isPending, submit, user, errors ])
}
