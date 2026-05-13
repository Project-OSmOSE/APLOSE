import React, { Fragment, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router'
import { IonNote } from '@ionic/react';

import { Button, Head, HelpButton, useModal } from '@/components/ui';

import { ImportFromPath, ServerItem } from '@/features/Storage';

import styles from './index.module.scss'

const StorageBrowser: React.FC = () => {
    const searchModal = useModal(ImportFromPath);

    return useMemo(() => <Fragment>
            <Head title="Storage"
                  buttons={
                      <Fragment>
                          <Button fill="clear"
                                  onClick={ searchModal.toggle }>
                              Search path
                          </Button>
                          <HelpButton url="/doc/user/data/generate"
                                      label="How to generate a dataset"/>
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
export const Route = createFileRoute('/_admin/storage/')({
    component: StorageBrowser,
})
