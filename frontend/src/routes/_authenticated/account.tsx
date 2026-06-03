import React, { useMemo } from 'react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { IonSpinner } from '@ionic/react';

import { FadedText, WarningText } from '@/components/ui';
import { FormBloc } from '@/components/form';

import { UpdateEmail, UpdatePassword } from '@/features/User';

import styles from './account.module.scss';

const Account: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    return useMemo(() =>
            <div className={ styles.page }>
                <h2>Account</h2>

                <div className={ styles.content }>
                    <FormBloc>
                        <div>
                            <FadedText>Username</FadedText>
                            <p>{ user.username }</p>
                        </div>
                    </FormBloc>

                    <UpdateEmail/>

                    <UpdatePassword/>
                </div>
            </div>,
        [ user ])
}

export const Route = createFileRoute('/_authenticated/account')({
    component: Account,
    pendingComponent: IonSpinner,
    errorComponent: WarningText,
})
