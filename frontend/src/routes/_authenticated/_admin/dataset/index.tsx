import React, { Fragment, type ReactNode } from 'react';
import { IonSpinner } from '@ionic/react';
import { createFileRoute } from '@tanstack/react-router'

import { Head, Link } from '@/components/ui';

import { DatasetTable } from '@/features/Dataset';
import { Dataset } from '@/features';
import { ensureValidQueryData } from '@/api/utils';

const Skeleton: React.FC<{ children: ReactNode }> = ({ children }) => (<Fragment>
        <Head title="Datasets"
              buttons={ <Link to="/storage" color="primary">Import datasets from storage</Link> }/>
        { children }
    </Fragment>
)

export const Route = createFileRoute('/_authenticated/_admin/dataset/')({
    loader: () => ensureValidQueryData(Dataset.API.allQuery),
    component: () => <Skeleton children={ <DatasetTable/> }/>,
    pendingComponent: () => <Skeleton children={ <IonSpinner/> }/>,
})
