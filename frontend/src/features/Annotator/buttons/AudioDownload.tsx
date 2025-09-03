import React, { Fragment } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { UserAPI } from "@/service/api/user.ts";
import { useAnnotatorAudio } from "@/features/Annotator";

export const AudioDownloadButton: React.FC = () => {
  const { audioPath } = useAnnotatorAudio()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();

  const download = () => {
    if (!audioPath) return;
    const link = document.createElement('a');
    link.href = audioPath;
    link.target = '_blank';
    const pathSplit = audioPath.split('/')
    link.download = pathSplit[pathSplit.length - 1];
    link.click();
  }

  if (!audioPath || !user?.is_staff) return <Fragment/>
  return <IonButton color='medium' size='small' fill='outline'
                    onClick={ download }>
    <IonIcon icon={ downloadOutline } slot="start"/>
    Download audio
  </IonButton>
}