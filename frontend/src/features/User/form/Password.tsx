import React, { useCallback, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { BaseUIEvent } from '@base-ui/react';
import type { Errors } from '@base-ui/react/internals/form-context';
import { cleanGqlErrors } from '@/api/utils';
import { Button, ButtonGroup, Field, Fieldset, Form, Spinner, Toast } from '@/components/base';
import { updatePasswordMutation } from '../api';

const PWD_CONSTRAINTS: Omit<Partial<Field.ControlProps>, 'required' | 'autoComplete'> = {
    minLength: 8,
}

export const PasswordForm: React.FC<{ id?: string }> = ({ id }) => {
    const [ newPasswordMismatch, setNewPasswordMismatch ] = useState<boolean>(false);
    const toastManager = Toast.useToastManager()
    const {
        mutate,
        isPending,
        data,
    } = useMutation(updatePasswordMutation)

    const submit = useCallback(async (event: BaseUIEvent<React.FormEvent<HTMLFormElement>>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newPassword = formData.get('newPassword') as string;
        const newPasswordConfirm = formData.get('newPasswordConfirm') as string;

        if (newPasswordConfirm !== newPassword) {
            return setNewPasswordMismatch(true)
        }

        const oldPassword = formData.get('oldPassword') as string;
        try {
            await mutate({ oldPassword, newPassword })
        } catch (error) {
            toastManager.addError({ title: 'Password update failed', error })
        }
    }, [ mutate, toastManager ])

    const errors: Errors | undefined = useMemo(() => {
        const baseErrors = cleanGqlErrors(data?.errors)
        if (newPasswordMismatch)
            baseErrors.newPasswordConfirm = 'The confirmation password does not match the given new password.'
        return baseErrors
    }, [ data, newPasswordMismatch ])

    return <Form id={ id }
                 onSubmit={ submit }
                 errors={ errors }>
        <Fieldset.Root>
            <Fieldset.Legend>Update password</Fieldset.Legend>

            <Field.Root name="oldPassword">
                <Field.Label>Old password</Field.Label>
                <Field.Control required
                               type="password"
                               autoComplete="current-password"/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="newPassword">
                <Field.Label>New password</Field.Label>
                <Field.Control required
                               type="password"
                               autoComplete="new-password"
                               { ...PWD_CONSTRAINTS } />
                <Field.Error/>
            </Field.Root>

            <Field.Root name="newPasswordConfirm">
                <Field.Label>Confirm new password</Field.Label>
                <Field.Control required
                               type="password"
                               autoComplete="new-password"
                               { ...PWD_CONSTRAINTS } />
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
