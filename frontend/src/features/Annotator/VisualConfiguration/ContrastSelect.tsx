import React, { Fragment } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { contrastOutline } from 'ionicons/icons/index.js';
import { Input } from '@/components/form';
import { useAnnotatorVisualConfiguration } from './hooks'
import { useCurrentCampaign } from '@/api';

export const ContrastSelect: React.FC = () => {
  const { campaign } = useCurrentCampaign()
  const {
    contrast,
    setContrast,
    resetContrast,
  } = useAnnotatorVisualConfiguration()

  if (!campaign?.allowImageTuning) return <Fragment/>
  return <div>
    <IonButton color="primary" fill="default" onClick={ resetContrast }>
      <IonIcon icon={ contrastOutline } slot="icon-only"/>
    </IonButton>
    <Input type="range" name="brightness-range" min="0" max="100"
           value={ contrast }
           onChange={ e => setContrast(e.target.valueAsNumber) }
           onDoubleClick={ resetContrast }/>
    <Input type="number" name="brightness" min="0" max="100"
           value={ contrast }
           onChange={ e => setContrast(e.target.valueAsNumber) }/>
  </div>
}
