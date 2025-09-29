import React, { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { IonBadge, IonIcon, IonNote, IonSkeletonText } from "@ionic/react";
import { Color } from "@ionic/core";
import { crop } from "ionicons/icons";

import { dateToString, getErrorMessage, pluralize } from "@/service/function.ts";
import { Progress, SkeletonProgress, WarningText } from "@/components/ui";
import styles from "./styles.module.scss";
import { useListCampaignsAndPhasesQuery } from "../api";
import { useCampaignFilters } from "../hooks";
import { useCurrentUser } from "@/features/auth/api";

export const Cards: React.FC = () => {
  const { params } = useCampaignFilters()
  const { user } = useCurrentUser();
  const {
    data,
    isFetching,
    error
  } = useListCampaignsAndPhasesQuery(params, { skip: !user });
  const campaigns = useMemo(() => {
    return data?.allAnnotationCampaigns?.results.filter(r => r !== null).map(c => ({
      ...c,
      phases: data?.allAnnotationPhases?.results.filter(r => r !== null).filter(p => p.annotationCampaignPk === c.pk) ?? []
    }))
  }, [ data ])
  const navigate = useNavigate();


  const getLink = useCallback((campaign: { pk: number, phases: any[] }) => {
    if (campaign.phases.length > 0)
      return `/annotation-campaign/${ campaign.pk }/phase/Annotation`;
    return `/annotation-campaign/${ campaign.pk }`
  }, [])
  const accessDetail = useCallback((campaign: {
    pk: number,
    phases: any[]
  }) => navigate(getLink(campaign)), [ getLink ]);
  const accessAuxDetail = useCallback((campaign: {
    pk: number,
    phases: any[]
  }) => window.open(`/app${ getLink(campaign) }`, '_blank'), [ getLink ]);

  const getDeadline = useCallback((campaign: {
    deadline?: string | null
  }): Date | undefined => campaign.deadline ? new Date(campaign.deadline) : undefined, []);
  const getBadgeLabel = useCallback((campaign: { isArchived: boolean, deadline?: string | null }) => {
    if (campaign.isArchived) return 'Archived'
    const deadline = getDeadline(campaign)
    if (deadline && (deadline.getTime() - 7 * 24 * 60 * 60 * 1000) <= Date.now())
      return `Due date: ${ dateToString(deadline) }`
    return 'Open'
  }, [ getDeadline ])
  const getColor = useCallback((campaign: { isArchived: boolean, deadline?: string | null }): Color => {
    switch (getBadgeLabel(campaign)) {
      case 'Open':
        return 'secondary';
      case 'Archived':
        return 'medium';
      default: // Due date
        return 'warning';
    }
  }, [ getBadgeLabel ]);

  const getUserTotal = useCallback((campaign: { phases: { userTasksCount: number }[] }) => {
    return campaign.phases.reduce((previousValue, p) => previousValue + p.userTasksCount, 0);
  }, []);
  const getUserProgress = useCallback((campaign: { phases: { userCompletedTasksCount: number }[] }) => {
    return campaign.phases.reduce((previousValue, p) => previousValue + p.userCompletedTasksCount, 0);
  }, []);
  const getTotal = useCallback((campaign: { phases: { tasksCount: number }[] }) => {
    return campaign.phases.reduce((previousValue, p) => previousValue + p.tasksCount, 0);
  }, []);
  const getProgress = useCallback((campaign: { phases: { completedTasksCount: number }[] }) => {
    return campaign.phases.reduce((previousValue, p) => previousValue + p.completedTasksCount, 0);
  }, []);

  if (isFetching)
    return <div className={ styles.cards }><SkeletonCards/></div>

  if (error)
    return <WarningText>{ getErrorMessage(error) }</WarningText>

  if (!campaigns || campaigns.length === 0)
    return <IonNote color="medium">No campaigns</IonNote>

  return <div className={ styles.cards }>
    { campaigns?.map(c => <div key={ c.pk }
                               className={ [ styles.card, 'campaign-card' ].join(' ') }
                               onClick={ () => accessDetail(c) } onAuxClick={ () => accessAuxDetail(c) }>
      {/*campaign-card classname for test purpose*/ }

      <div className={ styles.head }>
        <IonBadge color={ getColor(c) } children={ getBadgeLabel(c) }/>
        <p className={ styles.campaign }>{ c.name }</p>
        <p className={ styles.dataset }>{ c.datasetName }</p>
      </div>

      <div className={ styles.property }>
        <IonIcon className={ styles.icon } icon={ crop }/>
        <p className={ styles.label }>Phase{ pluralize(c.phases) }:</p>
        <p>{ c.phases && c.phases.length > 0 ? c.phases.map(p => p.phase).join(', ') : 'No phase' }</p>
      </div>

      { getUserTotal(c) > 0 && <Progress label='My progress'
                                         className={ styles.userProgression }
                                         color={ getColor(c) }
                                         value={ getUserProgress(c) }
                                         total={ getUserTotal(c) }/> }

      { getTotal(c) > 0 && <Progress label='Global progress'
                                     className={ styles.progression }
                                     value={ getProgress(c) }
                                     total={ getTotal(c) }/> }

    </div>) }
  </div>
}


const SkeletonCards: React.FC = () => (Array.from(new Array(7)).map((_, i) => <SkeletonCard key={ i }/>))

const SkeletonCard: React.FC = () => (
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