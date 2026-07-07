import React, { type ReactNode } from 'react';
import { createFileRoute } from '@tanstack/react-router'

import { Head } from '@/components/ui';

import { DatasetTable, DatasetAPI } from '@/features/Dataset';
import { ensureValidQueryData } from '@/api/utils';
import { Link } from '@/components/base/Button';
import { Content } from '@/components/layout/Content';
import { Spinner } from '@/components/base/Spinner';
import { Center } from '@/components/layout/Display';

const Skeleton: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Content oneContent>
        <Head title="Datasets"
              buttons={ <Link to="/storage" color="primary">Import datasets from storage</Link> }/>
        { children }
    </Content>
)

export const Route = createFileRoute('/_authenticated/_admin/dataset/')({
    loader: () => ensureValidQueryData(DatasetAPI.allWithCampaignsQuery),
    component: () => <Skeleton children={ <DatasetTable/> }/>,
    pendingComponent: () => <Skeleton children={ <Center><Spinner/></Center> }/>,
})
