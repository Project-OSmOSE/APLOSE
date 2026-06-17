import React from 'react';
import { createLazyFileRoute, useLoaderData } from '@tanstack/react-router';

import { Head } from '@/components/ui';

import { UserForm } from '@/features/User';
import { Field } from '@/components/base/Field';
import { Form } from '@/components/base/Form';
import { Content } from '@/components/layout/Content';

import styles from './account.module.scss'

const Account: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    return <Content start className={ styles.Content }>
        <Head title="Account"/>

        <Form>
            <Field.Root>
                <Field.Label>Username</Field.Label>
                <Field.Control value={ user.username } type="text" disabled/>
            </Field.Root>
        </Form>

        <UserForm.Email/>

        <UserForm.Password/>
    </Content>
}

export const Route = createLazyFileRoute('/_authenticated/account')({
    component: Account,
})
