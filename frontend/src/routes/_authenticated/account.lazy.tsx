import React, { useMemo } from 'react';
import { createLazyFileRoute } from '@tanstack/react-router';
import { IonSpinner } from '@ionic/react';

import { FadedText, GraphQLErrorText } from '@/components/ui';
import { FormBloc } from '@/components/form';

import { useCurrentUser } from '@/api';

import { UpdateEmail, UpdatePassword } from '@/features/User';

import styles from './account.module.scss';

const Account: React.FC = () => {
    const { user, isLoading, error } = useCurrentUser();

    return useMemo(() =>
            <div className={ styles.page }>
                <h2>Account</h2>

                { isLoading && <IonSpinner/> }
                { error && <GraphQLErrorText error={ error }/> }

                { user && <div className={ styles.content }>
                    <FormBloc>
                        <div>
                            <FadedText>Username</FadedText>
                            <p>{ user.username }</p>
                        </div>
                    </FormBloc>

                    <UpdateEmail/>

                    <UpdatePassword/>
                </div> }
            </div>,
        [ user, isLoading, error ])
}

export const Route = createLazyFileRoute('/_authenticated/account')({
    component: Account,
})
