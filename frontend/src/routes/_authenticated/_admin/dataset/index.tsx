import React, { Fragment } from 'react';
import { createFileRoute } from '@tanstack/react-router'

import { Head, Link } from '@/components/ui';

import { DatasetTable } from '@/features/Dataset';
import { queryClient } from '@/api/queryClient';
import { Dataset } from '@/features';

const DatasetList: React.FC = () => (<Fragment>
        <Head title="Datasets"
              buttons={ <Link to="/storage" color="primary">Import datasets from storage</Link> }/>

        <DatasetTable/>

    </Fragment>
)

export const Route = createFileRoute('/_authenticated/_admin/dataset/')({
    loader: () => queryClient.ensureQueryData(Dataset.API.allQuery),
    component: DatasetList,
})
