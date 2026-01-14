import React, { Fragment, useCallback } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { pause, play } from 'ionicons/icons/index.js';
import { Kbd, TooltipOverlay } from '@/components/ui';
import { useAudio } from './context';

export const PlayPauseButton: React.FC = () => {
  const audio = useAudio()

  const toggle = useCallback(() => {
    switch (audio.state) {
      case 'play':
        audio.pause()
        break;
      case 'pause':
        audio.play();
        break;
    }
  }, [ audio.state ])

  if (!audio.source) return <Fragment/>
  return <TooltipOverlay title="Shortcut" tooltipContent={ <p><Kbd keys="space"/> : Play/Pause audio</p> }>
    <IonButton color={ 'primary' }
               shape={ 'round' }
               onClick={ toggle }>
      { audio.state === 'pause' && <IonIcon icon={ play } slot={ 'icon-only' }/> }
      { audio.state === 'play' && <IonIcon icon={ pause } slot={ 'icon-only' }/> }
    </IonButton>
  </TooltipOverlay>
}