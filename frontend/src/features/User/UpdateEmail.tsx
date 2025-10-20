import React, { useEffect, useState } from 'react';
import { FormBloc, Input } from '@/components/form';
import { IonButton, IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';
import { useToast } from '@/components/ui';
import { getErrorMessage } from '@/service/function';

import { useCurrentUser, useUpdateCurrentUserEmail } from '@/api';

export const UpdateEmail: React.FC = () => {
  const { user } = useCurrentUser();
  const {
    updateEmail,
    isLoading: isSubmitting,
    error: patchError,
    formErrors,
    isSuccess: isPatchSuccessful,
  } = useUpdateCurrentUserEmail();

  const toast = useToast();

  const [ email, setEmail ] = useState<string>(user?.email ?? '');
  const [ errors, setErrors ] = useState<{ email?: string[] }>({});

  useEffect(() => {
    setEmail(user?.email ?? '')
  }, [ user ]);

  useEffect(() => {
    if (patchError) {
      const error = getErrorMessage(patchError);
      if (!error) return;
      try {
        toast.raiseError({ error: patchError })
        setErrors(JSON.parse(error))
      } catch { /* empty */
      }
    }
  }, [ patchError ]);

  useEffect(() => {
    if (formErrors) {
      setErrors({
        email: formErrors.find(e => e.field === 'email')?.messages,
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
    updateEmail({ email })
  }

  return <FormBloc label="Update email">
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
      { isSubmitting && <IonSpinner slot="end"/> }
    </IonButton>
  </FormBloc>
}