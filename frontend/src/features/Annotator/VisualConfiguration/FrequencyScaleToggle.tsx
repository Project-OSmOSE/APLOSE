import React, { useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { analyticsOutline, reorderFourOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { toggleFrequencyScaleType } from './slice';
import { selectFrequencyScaleType } from './selectors';

export const FrequencyScaleToggle: React.FC = () => {
  const frequencyScaleType = useAppSelector(selectFrequencyScaleType);
  const dispatch = useAppDispatch();

  const toggle = useCallback(() => dispatch(toggleFrequencyScaleType()), [dispatch]);

  const isLinear = frequencyScaleType === 'linear';

  return (
    <IonButton
      fill="clear"
      size="small"
      onClick={toggle}
      title={isLinear ? 'Switch to logarithmic frequency scale' : 'Switch to linear frequency scale'}
    >
      <IonIcon
        slot="icon-only"
        icon={isLinear ? analyticsOutline : reorderFourOutline}
      />
      <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
        {isLinear ? 'Lin' : 'Log'}
      </span>
    </IonButton>
  );
};
