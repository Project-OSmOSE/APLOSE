import type { AnnotationCampaignNode } from '@/api';
import type { BaseColor } from '@/components/base/types';

export const NOW = Date.now()
export const DAY = 24 * 60 * 60 * 1000

type CampaignState = 'Archived' | 'Due date' | 'Open'
type StateReturnType = {
    state: CampaignState & ('Due date')
    color: BaseColor
    dueDate: Date
} | {
    state: CampaignState & ('Archived' | 'Open')
    color: BaseColor
};
export const useCampaignState = (campaign: Pick<AnnotationCampaignNode, 'isArchived' | 'deadline'>): StateReturnType => {
    if (campaign.isArchived) return { state: 'Archived', color: 'medium' }

    const dueDate = campaign.deadline ? new Date(campaign.deadline) : undefined;
    if (dueDate) {
        if ((dueDate.getTime()) <= NOW)
            return { state: 'Due date', dueDate, color: 'danger' }
        if ((dueDate.getTime() - 7 * DAY) <= NOW)
            return { state: 'Due date', dueDate, color: 'warning' }
    }

    return { state: 'Open', color: 'primary' }
}