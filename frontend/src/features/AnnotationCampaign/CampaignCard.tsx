import React, { useMemo } from 'react';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router'
import { IonBadge, IonIcon, IonNote, IonSkeletonText } from '@ionic/react';
import { Color } from '@ionic/core';
import { crop } from 'ionicons/icons/index.js';

import { GraphQLErrorText, Progress, SkeletonProgress } from '@/components/ui';

import { AllCampaignFilters, type ListCampaignsQuery, useAllCampaigns } from '@/api';
import { dateToString, pluralize } from '@/service/function';

import { Route } from '@/routes/_authenticated/annotation-campaign'

import styles from './styles.module.scss';

type Campaign = NonNullable<NonNullable<ListCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;
export const Cards: React.FC<{ filters?: AllCampaignFilters }> = ({ filters }) => {
    const searchParams = Route.useSearch();
    const {
        allCampaigns,
        isFetching,
        error,
    } = useAllCampaigns({ ...searchParams, ...filters });

    return useMemo(() => {
        if (isFetching)
            return <div className={ styles.cards }>
                { Array.from(new Array(3)).map((_, i) => <SkeletonCard key={ i }/>) }
            </div>

        if (error)
            return <GraphQLErrorText error={ error }/>

        if (!allCampaigns || allCampaigns.length === 0)
            return <IonNote color="medium">No campaigns</IonNote>

        return <div className={ styles.cards }>
            { allCampaigns?.map(c => <Card key={ c.id } campaign={c}/>) }
        </div>
    }, [allCampaigns, isFetching, error])
}

const SkeletonCard: React.FC = React.memo(() => <div className={ styles.card }>

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
</div>)

const NOW = Date.now()

const Card: React.FC<{ campaign: Campaign }> = React.memo(({ campaign }) => {
    let color: Color = 'secondary';
    let badge: string = 'Open';

    if (campaign.isArchived) {
        badge = 'Archived'
        color = 'medium'
    }

    const deadline = campaign.deadline ? new Date(campaign.deadline) : undefined;
    if (deadline && (deadline.getTime() - 7 * 24 * 60 * 60 * 1000) <= NOW) {
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


    return <RouterLink to={ to } params={ params }>
        <div data-testid="campaign-card" className={ styles.card }>

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

        </div>
    </RouterLink>
})