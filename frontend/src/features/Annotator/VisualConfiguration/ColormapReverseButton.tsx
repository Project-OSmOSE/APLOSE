import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { invertModeSharp } from 'ionicons/icons/index.js';
import { useAppDispatch, useAppSelector } from '@/features/App';
import {
  revertColormap,
  selectIsColormapReversed,
  useCanChangeColormap,
} from '@/features/Annotator/VisualConfiguration';

export const ColormapReverseButton: React.FC = () => {
  const canChangeColormap = useCanChangeColormap();
  const isColormapReversed = useAppSelector(selectIsColormapReversed);
  const dispatch = useAppDispatch();

  const revert = useCallback(() => dispatch(revertColormap()), [dispatch])

  if (!canChangeColormap) return <Fragment/>
  return <IonButton color="primary"
                    fill={ isColormapReversed ? 'outline' : 'default' }
                    className={ isColormapReversed ? 'inverted' : '' }
                    onClick={ revert }>
    <IonIcon icon={ invertModeSharp } slot={ 'icon-only' }/>
  </IonButton>
}