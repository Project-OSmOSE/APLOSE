import React, { Fragment } from 'react';
import { createFileRoute } from '@tanstack/react-router'

import { HelpButton } from '@/components/base/Button';
import { Head } from '@/components/ui';

import { ServerItem, StorageModal } from '@/features/Storage';
import { Storage } from '@/features';
import { queryClient } from '@/api/queryClient';

import styles from './storage.module.scss'
import { Content } from '@/components/layout/Content';
import { Note } from '@/components/base/Note';
import { Spinner } from '@/components/base/Spinner';
import { Center } from '@/components/layout/Display';
import { Dialog } from '@/components/base/Dialog';

const StorageBrowser: React.FC = () => (
    <Content className={ styles.Storage }>
        <Head title="Storage"
              buttons={
                  <Fragment>
                      <Dialog.Root>
                          <Dialog.Trigger color="primary">Search path</Dialog.Trigger>
                          <StorageModal.Search/>
                      </Dialog.Root>
                      <HelpButton url="/doc/user/data/generate">
                          How to generate a dataset
                      </HelpButton>
                  </Fragment>
              }/>

        <div className={ styles.content }>
            <div className={ styles.inner }>
                <ServerItem name="datawork/datasets"/>
            </div>
        </div>
        <Note color="medium">
            Are available for import:
            <ul>
                <li>Datasets made with the legacy OSEkit (v{ '<' }0.2.5)</li>
                <li>Dataset and SpectroDataset analysis made with current OSEkit version</li>
            </ul>
        </Note>
    </Content>
)

export const Route = createFileRoute('/_authenticated/_admin/storage')({
    loader: () => queryClient.ensureQueryData(Storage.API.browseQuery({ path: '' })),
    component: StorageBrowser,
    pendingComponent: () => <Fragment>
        <Head title="Storage"/>
        <Center><Spinner/></Center>
    </Fragment>,
})
