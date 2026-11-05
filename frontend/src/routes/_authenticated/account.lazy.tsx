import React, { Fragment } from 'react';
import { createLazyFileRoute, useLoaderData } from '@tanstack/react-router';

import { Head } from '@/components/ui';
import { ExternalLink } from "@/components/base";
import { Content, Page } from '@/components/layout';
import { User } from '@/features/User';

import styles from './account.module.scss'

const Account: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    return <Page.Authenticated>
        <Content start oneContent>
            <Head title="Account" subtitle={ user.username }
                  buttons={ <Fragment>
                      <ExternalLink href="#email">Update email</ExternalLink>
                      <ExternalLink href="#password">Update password</ExternalLink>
                      <ExternalLink href="#label">Update label preferences</ExternalLink>
                  </Fragment> }
            />

            <Content inner className={ styles.Content }>
                <User.EmailForm id="email"/>
                <User.PasswordForm id="password"/>
                <User.LabelPreferenceForm id="label"/>
            </Content>
        </Content>
    </Page.Authenticated>
}

export const Route = createLazyFileRoute('/_authenticated/account')({
    component: Account,
})
