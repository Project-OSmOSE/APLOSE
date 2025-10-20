import React, { useCallback } from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { invertModeSharp } from "ionicons/icons";

export const ColormapInversionButton: React.FC<{
  inverted?: boolean,
  setInverted: (inverted: boolean) => void,
}> = (inverted, setInverted) => {

  const toggle = useCallback(() => {
    setInverted(!inverted);
  }, [ inverted, setInverted ])

  return <IonButton color="primary"
                    fill={ inverted ? "outline" : "default" }
                    className={ inverted ? "inverted" : "" }
                    onClick={ toggle }>
    <IonIcon icon={ invertModeSharp } slot={ "icon-only" }/>
  </IonButton>
}