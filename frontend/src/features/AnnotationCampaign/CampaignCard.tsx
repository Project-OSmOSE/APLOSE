import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonBadge, IonIcon, IonNote, IonSkeletonText } from '@ionic/react';
import { Color } from '@ionic/core';
import { crop } from 'ionicons/icons/index.js';

import { dateToString, pluralize } from '@/service/function';
import { Progress, SkeletonProgress, WarningText } from '@/components/ui';
import { type ListCampaignsQuery, useAllCampaigns, useAllCampaignsFilters } from '@/api';
import styles from './styles.module.scss';

type Campaign = NonNullable<NonNullable<ListCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;
export const Cards: React.FC = () => {
  const { params } = useAllCampaignsFilters()
  const {
    allCampaigns,
    isFetching,
    error,
  } = useAllCampaigns(params);
  const navigate = useNavigate();


  const getLink = useCallback((campaign: Campaign) => {
    if (campaign.phaseTypes.length > 0)
      return `/annotation-campaign/${ campaign.id }/phase/Annotation`;
    return `/annotation-campaign/${ campaign.id }`
  }, [])
  const accessDetail = useCallback((campaign: Campaign) => navigate(getLink(campaign)), [ getLink ]);
  const accessAuxDetail = useCallback((campaign: Campaign) => window.open(`/app${ getLink(campaign) }`, '_blank'), [ getLink ]);

  const getDeadline = useCallback((campaign: Campaign): Date | undefined => campaign.deadline ? new Date(campaign.deadline) : undefined, []);
  const getBadgeLabel = useCallback((campaign: Campaign) => {
    if (campaign.isArchived) return 'Archived'
    const deadline = getDeadline(campaign)
    if (deadline && (deadline.getTime() - 7 * 24 * 60 * 60 * 1000) <= Date.now())
      return `Due date: ${ dateToString(deadline) }`
    return 'Open'
  }, [ getDeadline ])
  const getColor = useCallback((campaign: Campaign): Color => {
    switch (getBadgeLabel(campaign)) {
      case 'Open':
        return 'secondary';
      case 'Archived':
        return 'medium';
      default: // Due date
        return 'warning';
    }
  }, [ getBadgeLabel ]);

  if (isFetching)
    return <div className={ styles.cards }>
      { Array.from(new Array(7)).map((_, i) => <SkeletonCard key={ i }/>) }
    </div>

  if (error)
    return <WarningText error={ error }/>

  if (!allCampaigns || allCampaigns.length === 0)
    return <IonNote color="medium">No campaigns</IonNote>

  return <div className={ styles.cards }>
    { allCampaigns?.map(c => <div key={ c.id }
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
        <p className={ styles.label }>Phase{ pluralize(c.phaseTypes) }:</p>
        <p>{ c.phaseTypes.length > 0 ? c.phaseTypes.join(', ') : 'No phase' }</p>
      </div>

      { c.userTasksCount > 0 && <Progress label="My progress"
                                          className={ styles.userProgression }
                                          color={ getColor(c) }
                                          value={ c.userCompletedTasksCount }
                                          total={ c.userTasksCount }/> }

      { c.tasksCount > 0 && <Progress label="Global progress"
                                      className={ styles.progression }
                                      value={ c.completedTasksCount }
                                      total={ c.tasksCount }/> }

    </div>) }
  </div>
}

const SkeletonCard: React.FC = () => (
  <div className={ styles.card }>

    <div className={ styles.head }>
      <IonBadge color="light">
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