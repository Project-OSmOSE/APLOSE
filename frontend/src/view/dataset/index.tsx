import React, { Fragment } from 'react';

import { Head } from "@/components/ui/Page.tsx";

import { DatasetTable } from "@/features/data/display";
import { ImportDatasetModalButton } from "@/features/data/import";


export const DatasetList: React.FC = () => (<Fragment>
    <Head title='Datasets'>
      <ImportDatasetModalButton/>
    </Head>

    <DatasetTable/>

  </Fragment>
)