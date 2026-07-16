import { createFileRoute } from '@tanstack/react-router'
import React, { useCallback } from 'react';
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { Button, CreateDialog } from '@/components/base';
import { Center } from '@/components/layout/Display';
import { AddSquare } from '@solar-icons/react';
import { MxCommon } from '@/features/Mx';

const RouteComponent: React.FC = () => {
    const createDialogManager = CreateDialog.useManager()

    const add = useCallback(() => {
        createDialogManager.create(MxCommon.NewPersonDialog)
    }, [ createDialogManager ])

    return <Content oneContent>
        <Head title="Persons" canGoBack>
            <Center>
                <Button onClick={ add }>
                    <AddSquare weight="Linear" size={ 20 }/>
                    Add person
                </Button>
            </Center>
        </Head>

    </Content>
}

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/common/person',
)({
    component: RouteComponent,
})
