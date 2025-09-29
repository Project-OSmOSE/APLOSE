import React, { Fragment } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { useAnnotatorAudio } from "@/features/Annotator";
import { useCurrentUser } from "@/features/auth/api";

export const AudioDownloadButton: React.FC = () => {
  const { audioPath } = useAnnotatorAudio()
  const { user } = useCurrentUser();

  const download = () => {
    if (!audioPath) return;
    const link = document.createElement('a');
    link.href = audioPath;
    link.target = '_blank';
    const pathSplit = audioPath.split('/')
    link.download = pathSplit[pathSplit.length - 1];
    link.click();
  }

  if (!audioPath || !user?.isAdmin) return <Fragment/>
  return <IonButton color='medium' size='small' fill='outline'
                    onClick={ download }>
    <IonIcon icon={ downloadOutline } slot="start"/>
    Download audio
  </IonButton>
}