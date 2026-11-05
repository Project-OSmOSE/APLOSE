import React, { useMemo } from 'react';
import { type LinkComponentProps } from '@tanstack/react-router'
import { cleanGqlList } from "@/api/utils.ts";
import { Card, Note, Progress } from '@/components/base';
import * as API from "../api";
import { CampaignBadge } from './Badge';
import { CampaignPhasesProgress } from './PhasesProgress';


export type CampaignCardProps = {
    campaign: API.AllFragment,
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
    let to: Pick<LinkComponentProps, 'to'>['to'] = '/annotation-campaign/$campaignID'
    const params: any = { campaignID: campaign.id }

    const phases = useMemo(() => cleanGqlList(campaign.phases?.results), [ campaign ])

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
