import React, { Fragment, MutableRefObject, useCallback, useState } from "react";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import { downloadOutline } from "ionicons/icons";
import { SpectrogramRender } from "../spectrogram";
import { useAnnotatorInput, useAnnotatorQuery } from "@/features/Annotator";
import { useCurrentUser } from "@/features/auth/api";

export const SpectrogramDownloadButton: React.FC<{
  render: MutableRefObject<SpectrogramRender | null>
}> = ({ render }) => {
  const { data } = useAnnotatorQuery()
  const { zoom } = useAnnotatorInput()
  const { user } = useCurrentUser();

  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  const download = useCallback(async () => {
    if (!data?.spectrogramById) return;
    const link = document.createElement('a');
    setIsLoading(true);
    const canvasData = await render.current?.getCanvasData().catch(e => {
      console.warn(e);
      setIsLoading(false)
    });
    if (!canvasData) return;
    link.href = canvasData;
    link.target = '_blank';
    link.download = `${ data?.spectrogramById.filename }-x${ zoom }.png`;
    link.click();
    setIsLoading(false);
  }, [ zoom ])

  if (!data?.spectrogramById || !user?.isAdmin) return <Fragment/>
  return <IonButton color='medium' size='small' fill='outline'
                    onClick={ download }>
    <IonIcon icon={ downloadOutline } slot="start"/>
    Download spectrogram (zoom x{ zoom })
    { isLoading && <IonSpinner/> }
  </IonButton>
}