import React, { Fragment, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { IonNote, IonSpinner } from '@ionic/react';

import { Button, HelpButton } from '@/components/base/Button';
import { Head, useModal } from '@/components/ui';

import { ImportFromPath, ServerItem } from '@/features/Storage';
import { Storage } from '@/features';
import { queryClient } from '@/api/queryClient';

import styles from './storage.module.scss'

const StorageBrowser: React.FC = () => {
    const searchModal = useModal(ImportFromPath);

    return useMemo(() => <Fragment>
            <Head title="Storage"
                  buttons={
                      <Fragment>
                          <Button color="primary" onClick={ searchModal.toggle }>
                              Search path
                          </Button>
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
            <IonNote>
                Are available for import:
                <ul>
                    <li>Datasets made with the legacy OSEkit (v{ '<' }0.2.5)</li>
                    <li>Dataset and SpectroDataset analysis made with current OSEkit version</li>
                </ul>
            </IonNote>

            { searchModal.element }
        </Fragment>,
        [ searchModal ])
}
export const Route = createFileRoute('/_authenticated/_admin/storage')({
    loader: () => queryClient.ensureQueryData(Storage.API.browseQuery({ path: '' })),
    component: StorageBrowser,
    pendingComponent: () => <Fragment>
        <Head title="Storage"/>
        <IonSpinner/>
    </Fragment>,
})
