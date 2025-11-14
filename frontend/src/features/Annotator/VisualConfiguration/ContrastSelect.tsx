import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { contrastOutline } from 'ionicons/icons/index.js';
import { Input } from '@/components/form';
import { useCurrentCampaign } from '@/api';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { resetContrast, setContrast } from './slice';
import { selectContrast } from './selectors';

export const ContrastSelect: React.FC = () => {
  const { campaign } = useCurrentCampaign()
  const contrast = useAppSelector(selectContrast);
  const dispatch = useAppDispatch();

  const set = useCallback((value: number) => dispatch(setContrast(value)), [])
  const reset = useCallback(() => dispatch(resetContrast()), [])

  if (!campaign?.allowImageTuning) return <Fragment/>
  return <div>
    <IonButton color="primary" fill="default" onClick={ reset }>
      <IonIcon icon={ contrastOutline } slot="icon-only"/>
    </IonButton>
    <Input type="range" name="brightness-range" min="0" max="100"
           value={ contrast }
           onChange={ e => set(e.target.valueAsNumber) }
           onDoubleClick={ reset }/>
    <Input type="number" name="brightness" min="0" max="100"
           value={ contrast }
           onChange={ e => set(e.target.valueAsNumber) }/>
  </div>
}
