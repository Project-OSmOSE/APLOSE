import React, { useEffect, useState } from "react";
import { FormBloc, Input } from "@/components/form";
import { IonButton, IonSpinner } from "@ionic/react";
import styles from "./styles.module.scss";
import { useToast } from "@/service/ui";
import { getErrorMessage } from "@/service/function.ts";
import { useCurrentUser, useUpdateCurrentUser } from "@/features/auth/api";

export const UpdateEmail: React.FC = () => {
  const { user } = useCurrentUser();
  const {
    updateCurrentUser,
    data: {
      isLoading: isSubmitting,
      error: patchError,
      formErrors,
      isSuccess: isPatchSuccessful
    }
  } = useUpdateCurrentUser();

  const toast = useToast();

  const [ email, setEmail ] = useState<string>(user?.email ?? '');
  const [ errors, setErrors ] = useState<{ email?: string[] }>({});

  useEffect(() => {
    setEmail(user?.email ?? '')
  }, [ user ]);

  useEffect(() => {
    if (patchError) {
      const e = getErrorMessage(patchError);
      if (!e) return;
      try {
        toast.presentError(e)
        setErrors(JSON.parse(e))
      } catch { /* empty */
      }
    }
  }, [ patchError ]);

  useEffect(() => {
    if (formErrors) {
      setErrors({
        email: formErrors.find(e => e.field === 'email')?.messages
      })
    }
  }, [ formErrors ]);

  useEffect(() => {
    if (isPatchSuccessful) {
      toast.presentSuccess('You email have been changed')
    }
  }, [ isPatchSuccessful ]);

  function submit() {
    setErrors({})
    updateCurrentUser({ email })
  }

  return <FormBloc label='Update email'>
    <Input value={ email }
           onChange={ e => setEmail(e.target.value) }
           error={ errors?.email?.join(' ') }
           placeholder="email"
           label="Email"
           type="email"
           autoComplete="email"/>

    <IonButton className={ styles.submit }
               disabled={ !email || isSubmitting }
               onClick={ submit }>
      Update
      { isSubmitting && <IonSpinner slot='end'/> }
    </IonButton>
  </FormBloc>
}