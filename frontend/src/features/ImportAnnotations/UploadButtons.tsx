import React, { useCallback, useEffect } from 'react';
import { IonButton, IonSpinner } from '@ionic/react';
import { useImportAnnotationsContext } from './context';
import styles from './styles.module.scss';
import { type AploseNavParams } from '@/features/UX';
import { useCurrentCampaign } from '@/api';
import { useNavigate, useParams } from 'react-router-dom';

export const UploadButtons: React.FC = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const { annotationPhase } = useCurrentCampaign()
  const { canImport, upload, ...state } = useImportAnnotationsContext()
  const navigate = useNavigate();

  const back = useCallback(() => {
    if (annotationPhase) navigate(`/annotation-campaign/${ campaignID }/phase/${ annotationPhase.phase }`)
    else navigate(`/annotation-campaign/${ campaignID }/phase/${ phaseType }`)
  }, [ campaignID, annotationPhase, phaseType ])

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