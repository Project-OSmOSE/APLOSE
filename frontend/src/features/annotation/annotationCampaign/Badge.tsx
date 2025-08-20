import React, { useMemo } from "react";
import { AnnotationCampaign } from "./api";
import { useCampaignState } from "./hook";
import { IonBadge } from "@ionic/react";
import { dateToString } from "@/service/function.ts";

export const AnnotationCampaignBadge: React.FC<{ campaign: AnnotationCampaign }> = ({ campaign }) => {
  const { state, color, deadline } = useCampaignState(campaign);
  const label = useMemo(() => {
    switch (state) {
      case 'open':
        return 'Open';
      case 'due date':
        return `Due date: ${ dateToString(deadline) }`
      case 'archived':
        return 'Archived'
    }
  }, [ campaign ])

  return <IonBadge color={ color } children={ label }/>
}