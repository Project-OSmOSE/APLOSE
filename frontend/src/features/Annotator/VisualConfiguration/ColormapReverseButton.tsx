import React, { Fragment } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { invertModeSharp } from 'ionicons/icons/index.js';
import { useAnnotatorVisualConfiguration } from './hooks';

export const ColormapReverseButton: React.FC = () => {
  const { canChangeColormap, isColormapReversed, revertColormap } = useAnnotatorVisualConfiguration()

  if (!canChangeColormap) return <Fragment/>
  return <IonButton color="primary"
                    fill={ isColormapReversed ? 'outline' : 'default' }
                    className={ isColormapReversed ? 'inverted' : '' }
                    onClick={ revertColormap }>
    <IonIcon icon={ invertModeSharp } slot={ 'icon-only' }/>
  </IonButton>
}