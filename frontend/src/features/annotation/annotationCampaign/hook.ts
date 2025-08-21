import { AnnotationCampaignState } from './api';
import { useMemo } from "react";
import { Color } from "@ionic/core";

export const useCampaignStateColor = (state?: string | null): Color => {
  return useMemo(() => {
    switch (state) {
      case AnnotationCampaignState.finished:
        return 'success';
      case AnnotationCampaignState.dueDate:
        return 'warning';
      case AnnotationCampaignState.archived:
        return 'medium';
      default:
        return 'secondary';
    }
  }, [ state ])
}
