import React from 'react';
import { AnnotationCampaignNode } from "@/api/types.gql-generated.ts";
import { dateToString } from '@/service/function';
import { Badge } from '@/components/base';
import { Campaign } from '@/features/AnnotationCampaign';

export type BadgeProps = {
    campaign: Pick<AnnotationCampaignNode, 'deadline' | 'archived'>
}

export const CampaignBadge: React.FC<BadgeProps> = ({ campaign }) => {
    const info = Campaign.useState(campaign)

    switch (info.state) {
        case 'Due date':
            return <Badge color={ info.color }>
                Due date: { dateToString(info.dueDate) }
            </Badge>
        default:
            return <Badge color={ info.color }>{ info.state }</Badge>
    }
}