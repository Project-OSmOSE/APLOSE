import React, { HTMLProps } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { AnnotationCampaignNode } from "@/api/types.gql-generated";
import { Badge, Link } from '@/components/base';

type BaseProps = Pick<HTMLProps<HTMLParagraphElement>, 'className'>
export const CampaignName: React.FC<{
    campaign: Pick<AnnotationCampaignNode, 'name' | 'archived'> & Partial<Pick<AnnotationCampaignNode, 'id'>>
    link?: true
} & BaseProps> = ({ campaign, link, ...props }) => {
    const { user } = useLoaderData({ from: '/_authenticated' })

    if (link && campaign.id && user.isAdmin)
        return <Link { ...props }
                     to="/annotation-campaign/$campaignID"
                     preload={ false }
                     params={ { campaignID: campaign.id } }
                     color="primary">
            { campaign.name }&nbsp;{ campaign.archived && <Badge color='medium'>Archived</Badge> }
        </Link>

    return <p { ...props }>
        { campaign.name }&nbsp;{ campaign.archived && <Badge color='medium'>Archived</Badge> }
    </p>
}
