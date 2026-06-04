import React from 'react';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router'
import { IonBadge, IonIcon, IonNote } from '@ionic/react';
import { Color } from '@ionic/core';
import { crop } from 'ionicons/icons/index.js';

import { Progress } from '@/components/ui';
import { dateToString, pluralize } from '@/service/function';

import styles from './styles.module.scss';
import { type AllCampaignsQuery } from './api';

type Campaign = NonNullable<NonNullable<AllCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;

export const Cards: React.FC<{ campaigns?: Campaign[] }> = React.memo(({ campaigns }) => {
    if (!campaigns || campaigns.length === 0)
        return <IonNote color="medium">No campaigns</IonNote>

    return <div className={ styles.cards }>
        { campaigns?.map(c => <Card key={ c.id } campaign={ c }/>) }
    </div>
})

const NOW = Date.now()

const Card: React.FC<{ campaign: Campaign }> = React.memo(({ campaign }) => {
    let color: Color = 'secondary';
    let badge: string = 'Open';

    const deadline = campaign.deadline ? new Date(campaign.deadline) : undefined;
    if (campaign.isArchived) {
        badge = 'Archived'
        color = 'medium'
    } else if (deadline && (deadline.getTime() - 7 * 24 * 60 * 60 * 1000) <= NOW) {
        badge = `Due date: ${ dateToString(deadline) }`
        color = 'warning'
    }

    let to: Pick<LinkComponentProps, 'to'>['to'] = '/annotation-campaign/$campaignID'
    const params: any = { campaignID: campaign.id }

    const phases = campaign.phases?.results.filter(p => p !== null) ?? []
    if (phases.length > 0) {
        to = '/annotation-campaign/$campaignID/phase/$phaseType'
        params.phaseType = phases[0].phase
    }


    return <RouterLink to={ to } preload={ false } params={ params } data-testid="campaign-card"
                       className={ styles.card }>
        {/*<div data-testid="campaign-card" className={ styles.card }>*/ }

        <div className={ styles.head }>
            <IonBadge color={ color } children={ badge }/>
            <p className={ styles.campaign }>{ campaign.name }</p>
            <p className={ styles.dataset }>{ campaign.datasetName }</p>
        </div>

        <div className={ styles.property }>
            <IonIcon className={ styles.icon } icon={ crop }/>
            <p className={ styles.label }>Phase{ pluralize(campaign.phases?.results) }:</p>
            <p>{ campaign.phases && campaign.phases?.results.length > 0 ? campaign.phases?.results.map(p => p?.phase).join(', ') : 'No phase' }</p>
        </div>

        { campaign.userTasksCount > 0 && <Progress label="My progress"
                                                   className={ styles.userProgression }
                                                   color={ color }
                                                   value={ campaign.userCompletedTasksCount }
                                                   total={ campaign.userTasksCount }/> }

        { campaign.tasksCount > 0 && <Progress label="Global progress"
                                               className={ styles.progression }
                                               value={ campaign.completedTasksCount }
                                               total={ campaign.tasksCount }/> }

        {/*</div>*/ }
    </RouterLink>
})