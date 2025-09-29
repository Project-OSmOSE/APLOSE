import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FormBloc, Input } from "@/components/form";
import { IonButton, IonSpinner } from "@ionic/react";
import styles from "./styles.module.scss";
import { useToast } from "@/service/ui";
import { getErrorMessage } from "@/service/function.ts";
import { useUpdatePasswordMutation } from "@/features/auth/api";
import { WarningText } from "@/components/ui";

export const UpdatePassword: React.FC = () => {
  const [ updatePassword, {
    data,
    isLoading: isSubmittingPassword,
    error: passwordError,
    isSuccess: isPasswordUpdateSuccessful
  } ] = useUpdatePasswordMutation();

  const toast = useToast();

  const [ oldPassword, setOldPassword ] = useState<string>('');
  const oldPasswordError = useMemo(() => {
    return data?.userUpdatePassword?.errors?.find(e => e?.field === "oldPassword")?.messages.join(', ')
  }, [ data ])
  const [ newPassword, setNewPassword ] = useState<string>('');
  const newPasswordError = useMemo(() => {
    return data?.userUpdatePassword?.errors?.find(e => e?.field === "newPassword")?.messages.join(', ')
  }, [ data ])
  const [ newPasswordConfirm, setNewPasswordConfirm ] = useState<string>('');


  useEffect(() => {
    if (passwordError) {
      toast.presentError(passwordError)
      return
    }
    if (data?.userUpdatePassword?.errors && data.userUpdatePassword.errors.length) return;
    if (isPasswordUpdateSuccessful) {
      toast.presentSuccess('You password have been changed')
      setOldPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
    }
  }, [ passwordError, data, isPasswordUpdateSuccessful ]);

  const submitPassword = useCallback(() => {
    updatePassword({ oldPassword, newPassword })
  }, [ oldPassword, newPassword ])

  return <FormBloc label='Update password'>

    { passwordError && <WarningText>{ getErrorMessage(passwordError) }</WarningText> }

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
               disabled={ !oldPassword || !newPassword || !newPasswordConfirm || isSubmittingPassword }
               onClick={ submitPassword }>
      Update
      { isSubmittingPassword && <IonSpinner slot='end'/> }
    </IonButton>
  </FormBloc>
}