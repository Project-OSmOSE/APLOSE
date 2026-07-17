import { createFileRoute } from '@tanstack/react-router'
import React, { useCallback } from 'react';
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import { Center } from '@/components/layout/Display';
import { MxEquipment } from '@/features/Mx';
import { Button, CreateDialog } from '@/components/base';
import { AddSquare } from '@solar-icons/react';

const RouteComponent: React.FC = () => {
    const createDialogManager = CreateDialog.useManager()

    const add = useCallback(() => {
        createDialogManager.create(MxEquipment.NewPlatformDialog)
    }, [ createDialogManager ])

    return <Content oneContent>
        <Head title="Platforms" canGoBack>
            <Center>
                <Button onClick={ add }>
                    <AddSquare weight="Linear" size={ 20 }/>
                    Add platform
                </Button>
            </Center>
        </Head>

    </Content>
}

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/equipment/platform',
)({
    component: RouteComponent,
})
