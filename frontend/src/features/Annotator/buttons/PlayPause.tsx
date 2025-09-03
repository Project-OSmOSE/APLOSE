import React, { MutableRefObject } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { pause, play } from "ionicons/icons";
import { Kbd } from "@/components/ui/Kbd.tsx";
import { TooltipOverlay } from "@/components/ui";
import { useAnnotatorAudio } from "@/features/Annotator";

export const PlayPauseButton: React.FC<{ player: MutableRefObject<HTMLAudioElement | null> }> = ({ player }) => {
  const { isPaused, playPause } = useAnnotatorAudio(player)

  return <TooltipOverlay title='Shortcut' tooltipContent={ <p><Kbd keys='space'/> : Play/Pause audio</p> }>
    <IonButton color={ "primary" }
               shape={ "round" }
               onClick={ () => playPause() }>
      { isPaused && <IonIcon icon={ play } slot={ "icon-only" }/> }
      { !isPaused && <IonIcon icon={ pause } slot={ "icon-only" }/> }
    </IonButton>
  </TooltipOverlay>
}