import React, { useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { IonButton, IonSpinner } from '@ionic/react';
import { AnnotationPhaseType } from '@/api';
import { useImportAnnotationsContext } from './context';
import styles from './styles.module.scss';
import { Route } from '@/routes/_authenticated/annotation-campaign/$campaignID._detailLayout/phase.$phaseType'

export const UploadButtons: React.FC = () => {
    const { campaignID } = Route.useParams();
    const search = Route.useSearch();
    const { canImport, upload, ...state } = useImportAnnotationsContext()
    const navigate = useNavigate()

    const back = useCallback(() => {
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType',
            params: {
                campaignID,
                phaseType: AnnotationPhaseType.Verification,
            },
            search,
        })
    }, [ campaignID, navigate, search ])

    useEffect(() => {
        if (state.uploadState === 'uploaded') back()
    }, [ state.uploadState ]);

    return <div className={ styles.uploadButtons }>
        <IonButton color="medium" fill="outline" onClick={ back }>
            Back to campaign
        </IonButton>

        { state.uploadState === 'uploading' && <IonSpinner/> }

        <IonButton disabled={ !canImport || state.uploadState === 'uploading' }
                   onClick={ () => upload() }>
            Import
        </IonButton>
    </div>
}