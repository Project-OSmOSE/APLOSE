import React from 'react';
import { type LinkComponentProps } from '@tanstack/react-router'
import { CampaignBadge } from './Badge';
import { Progress } from '@/components/base/Progress';
import { Card, Note } from '@/components/base';
import { CampaignPhasesProgress } from './PhasesProgress';
import { AnnotationCampaignNode, AnnotationPhaseNode } from "@/api";


export type CampaignCardProps = {
    campaign: Pick<AnnotationCampaignNode, 'name' | 'id' | 'archived' | 'deadline' | 'datasetName' | 'tasksCount' | 'completedTasksCount'>
    phases: Pick<AnnotationPhaseNode, 'phase' | 'archived' | 'userTasksCount' | 'userCompletedTasksCount'>[]
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, phases }) => {
    let to: Pick<LinkComponentProps, 'to'>['to'] = '/annotation-campaign/$campaignID'
    const params: any = { campaignID: campaign.id }

    if (phases.length > 0) {
        to = '/annotation-campaign/$campaignID/phase/$phaseType'
        params.phaseType = phases[0].phase
    }

    return <Card.Root to={ to }
                      preload={ false }
                      params={ params }
                      data-testid="campaign-card">
        <Card.Head>
            <CampaignBadge campaign={ campaign }/>
            <p>{ campaign.name }</p>
            <Note color="medium">{ campaign.datasetName }</Note>
        </Card.Head>

        <CampaignPhasesProgress userRelated
                                campaign={ campaign }
                                phases={ phases }/>

        { campaign.tasksCount ?
            <Progress value={ campaign.completedTasksCount / campaign.tasksCount * 100 }
                      color="medium">
                Campaign progress
            </Progress> : <Progress value={ campaign.completedTasksCount }
                                    max={ 0 }
                                    color="medium">
                Campaign progress
            </Progress> }
    </Card.Root>
}
