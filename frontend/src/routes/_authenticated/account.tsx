import React, { Fragment, useMemo } from 'react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { IonSpinner } from '@ionic/react';

import { Head, WarningText } from '@/components/ui';

import { UserForm } from '@/features/User';
import { Field } from '@/components/base/Field';
import { Form } from '@/components/base/Form';

const Account: React.FC = () => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    return useMemo(() => <Fragment>
        <Head title="Account"/>

        <Form>
            <Field.Root>
                <Field.Label>Username</Field.Label>
                <Field.Control value={ user.username } disabled/>
            </Field.Root>
        </Form>

        <UserForm.Email/>

        <UserForm.Password/>
    </Fragment>, [ user ])
}

export const Route = createFileRoute('/_authenticated/account')({
    component: Account,
    pendingComponent: IonSpinner,
    errorComponent: WarningText,
})
