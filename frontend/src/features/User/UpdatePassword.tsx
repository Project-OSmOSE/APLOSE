import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FormBloc, Input } from '@/components/form';
import { IonButton, IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';
import { useToast } from '@/components/ui';
import { useUpdateCurrentUserPassword } from '@/api';

export const UpdatePassword: React.FC = () => {
  const {
    updatePassword,
    isLoading: isUpdating,
    error: updateError,
    formErrors,
    isSuccess: isUpdateSuccessful,
  } = useUpdateCurrentUserPassword();

  const toast = useToast();

  const [ oldPassword, setOldPassword ] = useState<string>('');
  const oldPasswordError = useMemo(() => {
    return formErrors?.find(e => e?.field === 'oldPassword')?.messages.join(', ')
  }, [ formErrors ])
  const [ newPassword, setNewPassword ] = useState<string>('');
  const newPasswordError = useMemo(() => {
    return formErrors?.find(e => e?.field === 'newPassword')?.messages.join(', ')
  }, [ formErrors ])
  const [ newPasswordConfirm, setNewPasswordConfirm ] = useState<string>('');


  useEffect(() => {
    if (updateError) {
      toast.raiseError({ error: updateError })
      return
    }
    if (formErrors && formErrors.length) return;
    if (isUpdateSuccessful) {
      toast.presentSuccess('You password have been changed')
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
    }
  }, [ updateError, formErrors, isUpdateSuccessful ]);

  const submitPassword = useCallback(() => {
    updatePassword({ oldPassword, newPassword })
  }, [ oldPassword, newPassword ])

  return <FormBloc label="Update password">

    <Input value={ oldPassword }
           onChange={ e => setOldPassword(e.target.value) }
           error={ oldPasswordError }
           placeholder="password"
           label="Old password"
           type="password"
           autoComplete="current-password"/>

    <Input value={ newPassword }
           onChange={ e => setNewPassword(e.target.value) }
           error={ newPasswordError }
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