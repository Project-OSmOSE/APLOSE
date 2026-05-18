import React, { useEffect } from 'react';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { IonButton, IonSpinner } from '@ionic/react';
import { useImportAnnotationsContext } from './context';
import styles from './styles.module.scss';

export const UploadButtons: React.FC = () => {
    const { canImport, upload, ...state } = useImportAnnotationsContext()
    const canGoBack = useCanGoBack();
    const router = useRouter()

    useEffect(() => {
        if (state.uploadState === 'uploaded') router.history.back()
    }, [ state.uploadState ]);

    return <div className={ styles.uploadButtons }>
        <IonButton color="medium" fill="outline" disabled={ !canGoBack } onClick={ () => router.history.back() }>
            Back to campaign
        </IonButton>

        { state.uploadState === 'uploading' && <IonSpinner/> }

        <IonButton disabled={ !canImport || state.uploadState === 'uploading' }
                   onClick={ () => upload() }>
            Import
        </IonButton>
    </div>
}