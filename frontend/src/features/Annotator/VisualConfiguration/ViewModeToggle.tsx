import React, { useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { imageOutline, statsChartOutline } from 'ionicons/icons';
import { useAppDispatch, useAppSelector } from '@/features/App';
import { toggleViewMode } from './slice';
import { selectViewMode } from './selectors';
import { useAnnotationTask } from '@/api';

export const ViewModeToggle: React.FC = () => {
  const viewMode = useAppSelector(selectViewMode);
  const dispatch = useAppDispatch();
  const { spectrogram } = useAnnotationTask();

  const toggle = useCallback(() => dispatch(toggleViewMode()), [dispatch]);

  // Only show toggle if NetCDF data is available
  if (!spectrogram?.isNetcdf) return null;

  const isPngMode = viewMode === 'png';

  return (
    <IonButton
      fill="clear"
      size="small"
      onClick={toggle}
      title={isPngMode ? 'Switch to interactive NetCDF view' : 'Switch to fast PNG view'}
    >
      <IonIcon
        slot="icon-only"
        icon={isPngMode ? statsChartOutline : imageOutline}
      />
      <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem' }}>
        {isPngMode ? 'Interactive' : 'Fast'}
      </span>
    </IonButton>
  );
};
