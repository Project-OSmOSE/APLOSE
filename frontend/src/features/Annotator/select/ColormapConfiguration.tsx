import React, { useCallback, useEffect, useState } from "react";
import { Select } from "@/components/form";
import { Colormap, COLORMAP_GREYS, COLORMAPS } from "@/service/ui/color.ts";
import { IonButton, IonIcon } from "@ionic/react";
import { invertModeSharp } from "ionicons/icons";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useAnnotatorInput } from "@/features/Annotator";

export const ColormapConfiguration: React.FC = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const {
    analysis,
    colormap,
    invertedColormap,
    setColormap, invertColormap,
  } = useAnnotatorInput();

  const [ changeAllowed, setChangeAllowed ] = useState<boolean>(false);

  useEffect(() => {
    const computedAllowed: boolean = !!campaign?.allow_colormap_tuning && !!analysis && analysis.colormap.name === COLORMAP_GREYS
    setChangeAllowed(computedAllowed)
    if (computedAllowed) {
      setColormap(colormap ?? campaign?.colormap_default ?? COLORMAP_GREYS)
      if (invertedColormap ?? campaign?.colormap_inverted_default ?? false !== invertedColormap) invertColormap()
    }
  }, [ campaign, analysis ])

  const onSelect = useCallback((value: number | string | undefined) => {
    setColormap(value as Colormap)
  }, [ setColormap ])

  if (!changeAllowed) return;
  return <div>
    {/* Colormap selection */ }
    <Select required={ true } value={ colormap }
            placeholder="Select a colormap"
            onValueSelected={ onSelect }
            optionsContainer="popover"
            options={ Object.keys(COLORMAPS).map((cmap) => ({
              value: cmap, label: cmap, img: `/app/images/colormaps/${ cmap.toLowerCase() }.png`
            })) }/>

    {/* Colormap inversion */ }
    <IonButton color="primary"
               fill={ invertedColormap ? "outline" : "default" }
               className={ invertedColormap ? "inverted" : "" }
               onClick={ invertColormap }>
      <IonIcon icon={ invertModeSharp } slot={ "icon-only" }/>
    </IonButton>
  </div>;
}
