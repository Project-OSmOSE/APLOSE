import React, { type ReactNode, useMemo } from 'react';
import { Link } from '@/components/ui';


export const CampaignName: React.FC<{
    children: ReactNode,
    id?: string
    link?: true
}> = ({ children, id, link }) => useMemo(() => {
    if (link && id) return <Link to="/annotation-campaign/$campaignID"
                                 params={ { campaignID: id } }
                                 color="primary">{ children }</Link>
    return <p>{ children }</p>
}, [ children, id, link ])
