import React from 'react';
import { type AllCampaignsQuery } from '../api';
import { useCampaignState } from '../hooks';
import { dateToString } from '@/service/function';
import { Badge as BaseBadge } from '@/components/base/Badge';

type Campaign = NonNullable<NonNullable<AllCampaignsQuery['allAnnotationCampaigns']>['results'][number]>;

export type BadgeProps = { campaign: Pick<Campaign, 'deadline' | 'isArchived'> }

export const Badge: React.FC<BadgeProps> = ({ campaign }) => {
    const info = useCampaignState(campaign)

    switch (info.state) {
        case 'Due date':
            return <BaseBadge color={ info.color }>
                Due date: { dateToString(info.dueDate) }
            </BaseBadge>
        default:
            return <BaseBadge color={ info.color }>{ info.state }</BaseBadge>
    }
}