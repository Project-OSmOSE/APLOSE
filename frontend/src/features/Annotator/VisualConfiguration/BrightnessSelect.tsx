import React, { Fragment } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { sunnyOutline } from 'ionicons/icons/index.js';
import { Input } from '@/components/form';
import { useAnnotatorVisualConfiguration } from './hooks'
import { useCurrentCampaign } from '@/api';

export const BrightnessSelect: React.FC = () => {
  const { campaign } = useCurrentCampaign()
  const {
    brightness,
    setBrightness,
    resetBrightness,
  } = useAnnotatorVisualConfiguration()

  if (!campaign?.allowImageTuning) return <Fragment/>
  return <div>
    <IonButton color="primary" fill="default" onClick={ resetBrightness }>
      <IonIcon icon={ sunnyOutline } slot="icon-only"/>
    </IonButton>
    <Input type="range" name="brightness-range" min="0" max="100"
           value={ brightness }
           onChange={ e => setBrightness(e.target.valueAsNumber) }
           onDoubleClick={ resetBrightness }/>
    <Input type="number" name="brightness" min="0" max="100"
           value={ brightness }
           onChange={ e => setBrightness(e.target.valueAsNumber) }/>
  </div>
}
