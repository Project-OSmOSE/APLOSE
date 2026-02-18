import React, { Fragment } from 'react';
import { Button, Head, HelpButton, useModal } from '@/components/ui';
import { ImportFromPath, ServerItem } from '@/features/storage';
import styles from './styles.module.scss'
import { IonNote } from '@ionic/react';

export const StorageBrowser: React.FC = () => {
    const searchModal = useModal(ImportFromPath);

    return <Fragment>
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
            <ServerItem name="datawork/datasets"/>
        </div>
        <IonNote>
            Are available for import:
            <ul>
                <li>Datasets made with the legacy OSEkit (v{ '<' }0.2.5)</li>
                <li>Dataset and SpectroDataset analysis made with current OSEkit version</li>
            </ul>
        </IonNote>

        { searchModal.element }
    </Fragment>
}

export default StorageBrowser
