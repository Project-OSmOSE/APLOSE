import React, { useCallback, useMemo } from "react";
import styles from "./styles.module.scss";
import { AnnotationCampaign, AnnotationPhase } from "@/service/types";
import { useNavigate } from "react-router-dom";
import { IonBadge, IonIcon, IonNote } from "@ionic/react";
import { crop } from "ionicons/icons";
import { dateToString, getErrorMessage, pluralize } from "@/service/function.ts";
import { Progress, WarningText } from "@/components/ui";
import { Color } from "@ionic/core";
import { useCampaignFilters } from "@/service/slices/filter.ts";
import { CampaignAPI } from "@/service/api/campaign.ts";
import { CampaignPhaseAPI } from "@/service/api/campaign-phase.ts";
import { UserAPI } from "@/service/api/user.ts";
import { SkeletonCards } from "./SkeletonCard";

export const Cards: React.FC = () => {
  const { params } = useCampaignFilters()
  const { data: user } = UserAPI.endpoints.getCurrentUser.useQuery();
  const {
    data: campaigns,
    isFetching: isFetchingCampaigns,
    error: campaignsError,
  } = CampaignAPI.endpoints.listCampaign.useQuery(params, { skip: !user })
  const {
    data: phases,
    isFetching: isFetchingPhases,
    error: phasesError
  } = CampaignPhaseAPI.endpoints.listCampaignPhase.useQuery({ campaigns }, { skip: !campaigns })

  if (isFetchingCampaigns || isFetchingPhases)
    return <div className={ styles.cards }><SkeletonCards/></div>

  if (campaignsError || phasesError)
    return <WarningText>{ getErrorMessage(campaignsError ?? phasesError) }</WarningText>

  if (!campaigns || campaigns.length === 0 || !phases)
    return <IonNote color="medium">No campaigns</IonNote>

  return <div className={ styles.cards }>
    { campaigns?.map(c => <Card key={ c.id }
                                campaign={ {
                                  ...c,
                                  phases: phases.filter(p => p.annotation_campaign === c.id)
                                } }/>) }
  </div>
}

export const Card: React.FC<{
  campaign: Omit<AnnotationCampaign, 'phases'> & { phases: AnnotationPhase[] }
}> = ({ campaign }) => {
  const navigate = useNavigate();
  const link = useMemo(() => {
    if (campaign.phases.length > 0)
      return `/annotation-campaign/${ campaign.id }/phase/Annotation`;
    return `/annotation-campaign/${ campaign.id }`
  }, [ campaign ])
  const deadline: Date | undefined = useMemo(() => campaign.deadline ? new Date(campaign.deadline) : undefined, [ campaign.deadline ]);

  const accessDetail = useCallback(() => navigate(link), [ link ]);
  const accessAuxDetail = useCallback(() => window.open(`/app${ link }`, '_blank'), [ link ]);

  const badgeLabel = useMemo(() => {
    if (campaign.archive) return 'Archived'
    if (deadline && (deadline.getTime() - 7 * 24 * 60 * 60 * 1000) <= Date.now())
      return `Due date: ${ dateToString(deadline) }`
    return 'Open'
  }, [ campaign ])

  const color: Color = useMemo(() => {
    switch (badgeLabel) {
      case 'Open':
        return 'secondary';
      case 'Archived':
        return 'medium';
      default: // Due date
        return 'warning';
    }
  }, [ badgeLabel ]);

  const userTotal = useMemo(() => {
    return campaign.phases.reduce((previousValue: number, p: AnnotationPhase) => previousValue + p.user_total, 0);
  }, [ campaign.phases ]);

  const userProgress = useMemo(() => {
    return campaign.phases.reduce((previousValue: number, p: AnnotationPhase) => previousValue + p.user_progress, 0);
  }, [ campaign.phases ]);

  const total = useMemo(() => {
    return campaign.phases.reduce((previousValue: number, p: AnnotationPhase) => previousValue + p.global_total, 0);
  }, [ campaign.phases ]);

  const progress = useMemo(() => {
    return campaign.phases.reduce((previousValue: number, p: AnnotationPhase) => previousValue + p.global_progress, 0);
  }, [ campaign.phases ]);

  return (
    // campaign-card classname for test purpose
    <div className={ [ styles.card, 'campaign-card' ].join(' ') } onClick={ accessDetail }
         onAuxClick={ accessAuxDetail }>

      <div className={ styles.head }>
        <IonBadge color={ color } children={ badgeLabel }/>
        <p className={ styles.campaign }>{ campaign.name }</p>
        <p className={ styles.dataset }>{ campaign.dataset.name }</p>
      </div>

      <div className={ styles.property }>
        <IonIcon className={ styles.icon } icon={ crop }/>
        <p className={ styles.label }>Phase{ pluralize(campaign.phases) }:</p>
        <p>{ campaign.phases && campaign.phases.length > 0 ?
          campaign.phases.map(p => p.phase).join(', ') :
          'No phase' }</p>
      </div>

      { userTotal > 0 && <Progress label='My progress'
                                   className={ styles.userProgression }
                                   color={ color }
                                   value={ userProgress }
                                   total={ userTotal }/> }

      { total > 0 && <Progress label='Global progress'
                               className={ styles.progression }
                               value={ progress }
                               total={ total }/> }

    </div>
  )
}