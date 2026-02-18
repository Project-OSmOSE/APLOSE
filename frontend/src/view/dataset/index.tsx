import React, { Fragment } from 'react';

import { Head } from '@/components/ui';

import { DatasetTable } from '@/features/Dataset';


export const DatasetList: React.FC = () => (<Fragment>
    <Head title="Datasets"/>

    <DatasetTable/>

  </Fragment>
)

export default DatasetList
