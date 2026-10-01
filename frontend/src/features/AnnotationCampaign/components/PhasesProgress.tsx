import React from 'react';
import { type AnnotationCampaignNode, type AnnotationPhaseNode, } from '@/api/types.gql-generated';
import { Progress } from '@/components/base';
import { Campaign } from '@/features/AnnotationCampaign';

type Props = {
    userRelated?: false,
    phases: Pick<AnnotationPhaseNode, 'phase' | 'archived' | 'tasksCount' | 'completedTasksCount'>[]
    campaign: Pick<AnnotationCampaignNode, 'archived' | 'deadline'>
} | {
    userRelated: true,
    phases: Pick<AnnotationPhaseNode, 'phase' | 'archived' | 'userTasksCount' | 'userCompletedTasksCount'>[]
    campaign: Pick<AnnotationCampaignNode, 'archived' | 'deadline'>
}
export const CampaignPhasesProgress: React.FC<Props> = React.memo(({ userRelated, campaign, phases }) => {
    const { color } = Campaign.useState(campaign)

    return phases.sort((a, b) => a.phase.localeCompare(b.phase))
        .map(p => (
                <Progress key={ p.phase }
                          value={ userRelated ? (p as AnnotationPhaseNode).userCompletedTasksCount : (p as AnnotationPhaseNode).completedTasksCount }
                          max={ userRelated ? (p as AnnotationPhaseNode).userTasksCount : (p as AnnotationPhaseNode).tasksCount }
                          color={ p.archived ? 'medium' : color }>
                    { p.phase } { p.archived && <i>Closed</i> }
                </Progress>
            ),
        )
})