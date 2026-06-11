import React, { Fragment, type ReactNode } from 'react';
import { IonSpinner } from '@ionic/react';
import { createFileRoute } from '@tanstack/react-router'

import { Head } from '@/components/ui';

import { DatasetTable } from '@/features/Dataset';
import { queryClient } from '@/api/queryClient';
import { Dataset } from '@/features';
import { Link } from '@/components/base/Button';

const Skeleton: React.FC<{ children: ReactNode }> = ({ children }) => (<Fragment>
        <Head title="Datasets"
              buttons={ <Link to="/storage" color="primary">Import datasets from storage</Link> }/>
        { children }
    </Fragment>
)

export const Route = createFileRoute('/_authenticated/_admin/dataset/')({
    loader: () => queryClient.ensureQueryData(Dataset.API.allWithCampaignsQuery),
    component: () => <Skeleton children={ <DatasetTable/> }/>,
    pendingComponent: () => <Skeleton children={ <IonSpinner/> }/>,
})
