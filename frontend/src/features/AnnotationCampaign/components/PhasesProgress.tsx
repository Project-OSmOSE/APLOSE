import React from 'react';
import { useCampaignState } from '@/features/AnnotationCampaign/hooks';
import { Progress } from '@/components/base/Progress';
import {
    type AnnotationCampaignNode,
    type AnnotationPhaseNode,
    AnnotationPhaseType,
    type Maybe,
} from '@/api/types.gql-generated';

type Props = {
    userRelated?: false,
    campaign: Pick<AnnotationCampaignNode, 'isArchived' | 'deadline'> & {
        phases?: Maybe<{
            results: Array<Maybe<{
                phase: AnnotationPhaseType,
                isOpen: boolean;
                completedTasksCount: number,
                tasksCount: number,
            }>>
        }>;
    }
} | {
    userRelated: true,
    campaign: Pick<AnnotationCampaignNode, 'isArchived' | 'deadline'> & {
        phases?: Maybe<{
            results: Array<Maybe<{
                phase: AnnotationPhaseType,
                isOpen: boolean;
                userCompletedTasksCount: number,
                userTasksCount: number,
            }>>
        }>;
    }
}
export const PhasesProgress: React.FC<Props> = React.memo(({ userRelated, campaign }) => {
    const { state, color } = useCampaignState(campaign)

    return campaign.phases?.results
        .filter(p => !!p)
        .sort((a, b) => a.phase.localeCompare(b.phase))
        .map(p => (
            <Progress key={ p.phase }
                      value={ userRelated ? (p as AnnotationPhaseNode).userCompletedTasksCount : (p as AnnotationPhaseNode).completedTasksCount }
                      max={ userRelated? (p as AnnotationPhaseNode).userTasksCount : (p as AnnotationPhaseNode).tasksCount }
                      color={ !p.isOpen ? 'medium' : color }
                      disabled={ !p.isOpen || state == 'Archived' }>
                { p.phase } { !p.isOpen && <i>Closed</i> }
            </Progress>
        ),
    )
})