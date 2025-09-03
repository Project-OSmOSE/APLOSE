import React, { ChangeEvent, Fragment, useCallback } from "react";
import { Input } from "@/components/form";
import { IonButton, IonIcon } from "@ionic/react";
import { contrastOutline, sunnyOutline } from "ionicons/icons";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useAnnotatorInput } from "@/features/Annotator";

export const SpectrogramImage: React.FC = () => {
  const { campaign } = useRetrieveCurrentCampaign()

  const { brightness, setBrightness, contrast, setContrast } = useAnnotatorInput()

  const onBrightnessChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setBrightness(event.target.valueAsNumber)
  }, [ setBrightness ])
  const resetBrightness = useCallback(() => {
    setBrightness(50)
  }, [ setBrightness ])

  const onContrastChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setContrast(event.target.valueAsNumber)
  }, [ setContrast ])
  const resetContrast = useCallback(() => {
    setContrast(50)
  }, [ setContrast ])

  if (!campaign?.allow_image_tuning) return;
  return <Fragment>
    <div>
      <IonButton color="primary" fill="default" onClick={ resetBrightness }>
        <IonIcon icon={ sunnyOutline } slot="icon-only"/>
      </IonButton>
      <Input type="range" name="brightness-range" min="0" max="100" value={ brightness }
             onChange={ onBrightnessChange } onDoubleClick={ resetBrightness }/>
      <Input type="number" name="brightness" min="0" max="100" value={ brightness }
             onChange={ onBrightnessChange }/>
    </div>

    <div>
      <IonButton color="primary" fill="default" onClick={ resetContrast }>
        <IonIcon icon={ contrastOutline } slot="icon-only"/>
      </IonButton>
      <Input type="range" name="contrast-range" min="0" max="100" value={ contrast }
             onChange={ onContrastChange } onDoubleClick={ resetContrast }/>
      <Input type="number" name="contrast" min="0" max="100" value={ contrast }
             onChange={ onContrastChange }/>
    </div>
  </Fragment>;
}
