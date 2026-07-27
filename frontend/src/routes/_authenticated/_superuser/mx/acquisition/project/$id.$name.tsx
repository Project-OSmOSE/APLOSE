import { createFileRoute } from '@tanstack/react-router'
import { Content } from '@/components/layout/Content';
import { Head } from '@/components/ui';
import React, { Fragment } from 'react';
import { MxAcquisition } from '@/features/Mx';

const Component: React.FC = () => {
    const { id, name } = Route.useParams()

    // TODO: tabs???
    //  - scrollable content
    //  - List of prepared/not deployed deployments
    //  - List of ongoing deployments
    //  - List of lost deployments
    //  - Button to "Prepare deployment" = no deployment/recovery dates
    //  - "Deploy" on a deployment
    //  - "Recover" on a deployment

    return <Content oneContent>
        <Head title={ name } canGoBack
              buttons={ <Fragment>

              </Fragment> }/>
        <MxAcquisition.DeploymentTable projectID={ id }/>
        {/* TODO : scrollable + prepare deployment */ }
    </Content>
}

export const Route = createFileRoute(
    '/_authenticated/_superuser/mx/acquisition/project/$id/$name',
)({
    component: Component,
})
