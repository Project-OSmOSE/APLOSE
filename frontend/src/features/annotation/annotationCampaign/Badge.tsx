import React, { Fragment } from "react";
import { AnnotationCampaignState } from "./api";
import { useCampaignStateColor } from "./hook";
import { IonBadge } from "@ionic/react";
import { dateToString } from "@/service/function.ts";

export const AnnotationCampaignBadge: React.FC<{
  state?: string | null,
  deadline?: string | null,
}> = ({ state, deadline }) => {
  const color = useCampaignStateColor(state);
  if (!state) return <Fragment/>
  return <IonBadge color={ color }>
    { state }{ state === AnnotationCampaignState.dueDate && deadline && `: ${ dateToString(deadline) }` }
  </IonBadge>
}
