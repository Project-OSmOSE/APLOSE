import React, { Fragment } from 'react';

import { Head, Link } from '@/components/ui';

import { DatasetTable } from '@/features/Dataset';


export const DatasetList: React.FC = () => (<Fragment>
        <Head title="Datasets"
              buttons={ <Link appPath="/storage" color="primary">Import datasets from storage</Link> }/>

        <DatasetTable/>

    </Fragment>
)

export default DatasetList
