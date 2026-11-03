import React from 'react';
import { createLazyFileRoute, useLoaderData } from '@tanstack/react-router';

import { Head } from '@/components/ui';

import { User } from '@/features/User';
import { Content } from '@/components/layout/Content';
import { Page } from '@/components/layout';

import styles from './account.module.scss'

const Account: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    return <Page.Authenticated>
        <Content start oneContent>
            <Head title="Account" subtitle={ user.username }/>

            <Content inner className={ styles.Content }>

                <User.EmailForm/>

                <User.PasswordForm/>

                <User.LabelPreferenceForm/>
                
            </Content>
        </Content>
    </Page.Authenticated>
}

export const Route = createLazyFileRoute('/_authenticated/account')({
    component: Account,
})
