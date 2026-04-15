import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IonButton, IonSpinner } from '@ionic/react';
import { AnnotationPhaseType } from '@/api';
import { type AploseNavParams } from '@/features/UX';
import { useImportAnnotationsContext } from './context';
import styles from './styles.module.scss';

export const UploadButtons: React.FC = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const { canImport, upload, ...state } = useImportAnnotationsContext()
  const navigate = useNavigate();

  const back = useCallback(() => {
    navigate(`/annotation-campaign/${ campaignID }/phase/${ AnnotationPhaseType.Verification }`)
  }, [ campaignID, phaseType, navigate ])

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