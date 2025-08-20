import React, { useCallback, useMemo } from "react";
import { AnnotationCampaign } from "./api";
import styles from "./styles.module.scss";
import { IonBadge, IonIcon, IonSkeletonText } from "@ionic/react";
import { crop } from "ionicons/icons";
import { Progress, SkeletonProgress } from "@/components/ui";
import { pluralize } from "@/service/function.ts";
import { useNavigate } from "react-router-dom";
import { AnnotationCampaignBadge } from "./Badge.tsx";
import { useCampaignState } from "@/features/annotation/annotationCampaign/hook.ts";

export const AnnotationCampaignCard: React.FC<{ campaign: AnnotationCampaign }> = ({ campaign }) => {
  const navigate = useNavigate();
  const link = useMemo(() => `/annotation-campaign/${ campaign.id }`, [ campaign, ])
  const { color } = useCampaignState(campaign);

  const accessDetail = useCallback(() => navigate(link), [ link ]);
  const accessAuxDetail = useCallback(() => window.open(`/app${ link }`, '_blank'), [ link ]);

  return (
    // campaign-card classname for test purpose
    <div className={ [ styles.card, 'campaign-card' ].join(' ') } onClick={ accessDetail }
         onAuxClick={ accessAuxDetail }>

      <div className={ styles.head }>
        <AnnotationCampaignBadge campaign={ campaign }/>
        <p className={ styles.campaign }>{ campaign.name }</p>
        <p className={ styles.dataset }>{ campaign.dataset.name }</p>
      </div>

      <div className={ styles.property }>
        <IonIcon className={ styles.icon } icon={ crop }/>
        <p className={ styles.label }>Phase{ pluralize(campaign.phases ?? []) }:</p>
        <p>{ campaign.phases.length > 0 ?
          campaign.phases.map(p => p.phase).join(', ') : 'No phase' }</p>
      </div>

      { !!campaign.userTasksCount && <Progress label='My progress'
                                               className={ styles.userProgression }
                                               color={ color }
                                               value={ campaign.userFinishedTasksCount ?? 0 }
                                               total={ campaign.userTasksCount }/> }

      { !!campaign.tasksCount && <Progress label='Global progress'
                                           className={ styles.progression }
                                           value={ campaign.finishedTasksCount ?? 0 }
                                           total={ campaign.tasksCount }/> }

    </div>
  );
}

export const AnnotationCampaignCardLoadingSkeleton: React.FC = () => (
  <div className={ styles.card }>

    <div className={ styles.head }>
      <IonBadge color='light'>
        <IonSkeletonText animated style={ { width: 64 } }/>
      </IonBadge>
      <IonSkeletonText className={ styles.campaign } animated style={ { width: 128, height: '1ch' } }/>
      <IonSkeletonText className={ styles.dataset } animated style={ { width: 192, height: '1ch' } }/>
    </div>

    <div className={ styles.property }>
      <IonIcon className={ styles.icon } icon={ crop }/>
      <IonSkeletonText animated style={ { width: 128, height: '1ch' } }/>
    </div>

    <SkeletonProgress className={ styles.userProgression }/>
    <SkeletonProgress className={ styles.progression }/>
  </div>
)