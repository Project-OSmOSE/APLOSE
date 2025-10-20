import React, { Fragment } from 'react';

import { Head } from '@/components/ui';

import { DatasetTable, ImportDatasetModalButton } from '@/features/Dataset';


export const DatasetList: React.FC = () => (<Fragment>
    <Head title="Datasets">
      <ImportDatasetModalButton/>
    </Head>

    <DatasetTable/>

  </Fragment>
)