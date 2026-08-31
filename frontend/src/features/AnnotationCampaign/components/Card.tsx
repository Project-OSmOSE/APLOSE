import React from 'react';
import { type LinkComponentProps } from '@tanstack/react-router'
import { type AllCampaignsQuery } from '../api';
import { Badge } from '@/features/AnnotationCampaign/components/Badge';
import { Progress } from '@/components/base/Progress';
import { Card as BaseCard, Note } from '@/components/base';
import { PhasesProgress } from './PhasesProgress';

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

    return <BaseCard.Root to={ to }
                          preload={ false }
                          params={ params }
                          data-testid="campaign-card">
        <BaseCard.Head>
            <Badge campaign={ campaign }/>
            <p>{ campaign.name }</p>
            <Note color="medium">{ campaign.datasetName }</Note>
        </BaseCard.Head>

        <PhasesProgress userRelated campaign={ campaign }/>

        { campaign.tasksCount ?
            <Progress value={ campaign.completedTasksCount / campaign.tasksCount * 100 }
                      color="medium">
                Campaign progress
            </Progress> : <Progress value={ campaign.completedTasksCount }
                                    max={ 0 }
                                    color="medium">
                Campaign progress
            </Progress> }
    </BaseCard.Root>
}
