import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { invertModeSharp } from 'ionicons/icons/index.js';
import { useAppDispatch, useAppSelector } from '@/features/App';
import {
  revertColormap,
  selectCanChangeColormap,
  selectIsColormapReversed,
} from '@/features/Annotator/VisualConfiguration';

export const ColormapReverseButton: React.FC = () => {
  const canChangeColormap = useAppSelector(selectCanChangeColormap);
  const isColormapReversed = useAppSelector(selectIsColormapReversed);
  const dispatch = useAppDispatch();

  const revert = useCallback(() => dispatch(revertColormap()), [])

  if (!canChangeColormap) return <Fragment/>
  return <IonButton color="primary"
                    fill={ isColormapReversed ? 'outline' : 'default' }
                    className={ isColormapReversed ? 'inverted' : '' }
                    onClick={ revert }>
    <IonIcon icon={ invertModeSharp } slot={ 'icon-only' }/>
  </IonButton>
}