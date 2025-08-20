import React from "react";
import styles from './styles.module.scss'
import { useCampaignFilters } from "./filter";
import { AnnotationCampaignAPI } from "./api";
import { AnnotationCampaignCard, AnnotationCampaignCardLoadingSkeleton } from "./Card.tsx";
import { UserAPI } from "@/service/api/user.ts";
import { WarningText } from "@/components/ui";
import { getErrorMessage } from "@/service/function.ts";
import { IonNote } from "@ionic/react";

export const AnnotationCampaignCardGrid: React.FC<{}> = () => {
  const { params } = useCampaignFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();
  const {
    data: campaigns,
    isFetching,
    error
  } = AnnotationCampaignAPI.endpoints.getAnnotationCampaigns.useQuery({
    userID: user?.id.toString() ?? '',
    ...params
  }, {
    skip: !user
  })
  
  if (error) return <WarningText>{ getErrorMessage(error) }</WarningText>

  if (isFetching) {
    const skeletons = Array.from(new Array(7));
    return <div className={ styles.grid }>
      { skeletons.map((_, i) => <AnnotationCampaignCardLoadingSkeleton key={ i }/>) }
    </div>
  }

  if (!campaigns || campaigns.length === 0) return <IonNote color="medium"
                                                            style={ { textAlign: 'center' } }>
    No annotation campaigns
  </IonNote>

  return <div className={ styles.grid }>
    { campaigns.map(c => <AnnotationCampaignCard key={ c.id } campaign={ c }/>) }
  </div>
}