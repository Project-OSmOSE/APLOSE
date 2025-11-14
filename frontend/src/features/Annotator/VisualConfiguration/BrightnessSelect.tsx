import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { sunnyOutline } from 'ionicons/icons/index.js';
import { Input } from '@/components/form';
import { useCurrentCampaign } from '@/api';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { selectBrightness, setBrightness, resetBrightness } from '@/features/Annotator/VisualConfiguration';

export const BrightnessSelect: React.FC = () => {
  const { campaign } = useCurrentCampaign()
  const brightness = useAppSelector(selectBrightness);
  const dispatch = useAppDispatch();

  const set = useCallback((value: number) => dispatch(setBrightness(value)), [])
  const reset = useCallback(() => dispatch(resetBrightness()), [])

  if (!campaign?.allowImageTuning) return <Fragment/>
  return <div>
    <IonButton color="primary" fill="default" onClick={ reset }>
      <IonIcon icon={ sunnyOutline } slot="icon-only"/>
    </IonButton>
    <Input type="range" name="brightness-range" min="0" max="100"
           value={ brightness }
           onChange={ e => set(e.target.valueAsNumber) }
           onDoubleClick={ reset }/>
    <Input type="number" name="brightness" min="0" max="100"
           value={ brightness }
           onChange={ e => set(e.target.valueAsNumber) }/>
  </div>
}
