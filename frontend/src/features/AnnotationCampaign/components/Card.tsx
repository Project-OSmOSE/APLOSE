import React from 'react';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router'
import { type AllCampaignsQuery } from '../api';
import { Badge } from '@/features/AnnotationCampaign/components/Badge';
import { Progress } from '@/components/base/Progress';
import { cleanGqlList } from '@/api/utils';
import { useCampaignState } from '@/features/AnnotationCampaign/hooks';
import styles from './Card.module.scss';
import { Note } from '@/components/base/Note';

type Campaign = NonNullable<NonNullable<AllCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;

export type CardProps = { campaign: Campaign }

export const Card: React.FC<CardProps> = ({ campaign }) => {
    let to: Pick<LinkComponentProps, 'to'>['to'] = '/annotation-campaign/$campaignID'
    const params: any = { campaignID: campaign.id }

    const phases = campaign.phases?.results.filter(p => p !== null) ?? []
    if (phases.length > 0) {
        to = '/annotation-campaign/$campaignID/phase/$phaseType'
        params.phaseType = phases[0].phase
    }

    return <RouterLink to={ to }
                       preload={ false }
                       params={ params }
                       data-testid="campaign-card"
                       className={ styles.Card }>
        <div className={ styles.Info }>
            <Badge campaign={ campaign }/>
            <p>{ campaign.name }</p>
            <Note color="medium">{ campaign.datasetName }</Note>
        </div>

        <PhaseProgress campaign={ campaign }/>

        { campaign.tasksCount ?
            <Progress value={ campaign.completedTasksCount / campaign.tasksCount * 100 }
                      disabled={ campaign.isArchived }
                      color="medium">
                Campaign progress
            </Progress> : <Progress value={ campaign.completedTasksCount }
                                    max={ 0 }
                                    disabled={ campaign.isArchived }
                                    color="medium">
                Campaign progress
            </Progress> }
    </RouterLink>
}

const PhaseProgress: React.FC<{
    campaign: Pick<Campaign, 'phases' | 'isArchived' | 'deadline'>
}> = React.memo(({ campaign }) => {
    const { state, color } = useCampaignState(campaign)
    const phases = cleanGqlList(campaign.phases?.results).sort((a, b) => a.phase.localeCompare(b.phase))

    return phases.map(p => (
            <Progress key={ p.phase }
                      value={ p.userCompletedTasksCount }
                      max={ p.userTasksCount }
                      color={ !p.isOpen ? 'medium' : color }
                      disabled={ !p.isOpen || state == 'Archived' }>
                { p.phase } { !p.isOpen && <i>Closed</i> }
            </Progress>
        ),
    )
})