import React, { useCallback, useState } from 'react';
import { FormBloc, Input } from '@/components/form';
import { IonButton, IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';
import { useToast } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { type UpdateCurrentUserEmailMutation, updatePasswordMutation } from '@/features/User/api';

export const UpdatePassword: React.FC = () => {

    const [ oldPassword, setOldPassword ] = useState<string>('');
    const [ newPassword, setNewPassword ] = useState<string>('');
    const [ newPasswordConfirm, setNewPasswordConfirm ] = useState<string>('');

    const [ errors, setErrors ] = useState<{ oldPassword?: string[], newPassword?: string[] }>({});
    const toast = useToast();

    const onError = useCallback((error: Error) => {
        toast.raiseError({ error })
    }, [ toast ]);
    const onSuccess = useCallback((data: UpdateCurrentUserEmailMutation) => {
        const formErrors = data?.currentUserUpdate?.errors ?? []
        if (formErrors && formErrors.length) {
            setErrors({
                oldPassword: formErrors.find(e => e.field === 'oldPassword')?.messages,
                newPassword: formErrors.find(e => e.field === 'newPassword')?.messages,
            })
            return
        }
        toast.present('You password have been changed', 'success')
        setOldPassword('')
        setNewPassword('')
        setNewPasswordConfirm('')
    }, [ toast ]);

    const {
        mutate,
        isPending: isUpdating,
    } = useMutation({
        ...updatePasswordMutation,
        onError,
        onSuccess,
    })

    const submitPassword = useCallback(() => {
        mutate({ oldPassword, newPassword })
    }, [ oldPassword, newPassword, mutate ])

    return <FormBloc label="Update password">

        <Input value={ oldPassword }
               onChange={ e => setOldPassword(e.target.value) }
               error={ errors.oldPassword?.join(' ') }
               placeholder="password"
               label="Old password"
               type="password"
               autoComplete="current-password"/>

        <Input value={ newPassword }
               onChange={ e => setNewPassword(e.target.value) }
               error={ errors.newPassword?.join(' ') }
               placeholder="password"
               label="New password"
               type="password"
               autoComplete="new-password"/>

        <Input value={ newPasswordConfirm }
               onChange={ e => setNewPasswordConfirm(e.target.value) }
               error={ newPasswordConfirm !== newPassword ? 'The password are different' : undefined }
               placeholder="password"
               label="Confirm new password"
               type="password"
               autoComplete="new-password"/>

        <IonButton className={ styles.submit }
                   disabled={ !oldPassword || !newPassword || !newPasswordConfirm || isUpdating }
                   onClick={ submitPassword }>
            Update
            { isUpdating && <IonSpinner slot="end"/> }
        </IonButton>
    </FormBloc>
}