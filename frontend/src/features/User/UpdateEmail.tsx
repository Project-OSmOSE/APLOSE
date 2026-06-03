import React, { useCallback, useState } from 'react';
import { FormBloc, Input } from '@/components/form';
import { IonButton, IonSpinner } from '@ionic/react';
import styles from './styles.module.scss';
import { useToast } from '@/components/ui';
import { getErrorMessage } from '@/service/function';
import { useMutation, useQuery } from '@tanstack/react-query';
import { currentQuery, type UpdateCurrentUserEmailMutation, updateEmailMutation } from './api'
import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';

export const UpdateEmail: React.FC = () => {
    const { data: user } = useQuery(currentQuery)
    const toast = useToast();
    const [ errors, setErrors ] = useState<{ email?: string[] }>({});

    const onError = useCallback((patchError: Error) => {
        if (patchError) {
            const error = getErrorMessage(patchError);
            if (!error) return;
            try {
                toast.raiseError({ error: patchError })
                setErrors(JSON.parse(error))
            } catch { /* empty */
            }
        }
    }, [ toast ]);
    const onSuccess = useCallback((data: UpdateCurrentUserEmailMutation) => {
        const formErrors = data?.currentUserUpdate?.errors ?? []
        if (formErrors && formErrors.length) {
            setErrors({
                email: formErrors.find(e => e.field === 'email')?.messages,
            })
            return
        }
        queryClient.invalidateQueries({ queryKey: queryKeys.user.current })
        toast.present('You email have been changed', 'success')
    }, [ toast ]);

    const {
        mutate,
        isPending: isSubmitting,
    } = useMutation({
        ...updateEmailMutation,
        onError,
        onSuccess,
    })

    const [ email, setEmail ] = useState<string>(user?.email ?? '');

    const submit = useCallback(() => {
        setErrors({})
        mutate({ email })
    }, [ mutate, setErrors, email ])

    return <FormBloc label="Update email">
        <Input value={ email }
               onChange={ e => setEmail(e.target.value) }
               error={ errors?.email?.join(' ') }
               placeholder={ user?.email ?? 'email' }
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