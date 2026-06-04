import React, { type ReactNode, useMemo } from 'react';
import { Link } from '@/components/base/Button';


export const CampaignName: React.FC<{
    children: ReactNode,
    id?: string
    link?: true
}> = ({ children, id, link }) => useMemo(() => {
    if (link && id) return <Link to="/annotation-campaign/$campaignID"
                                 params={ { campaignID: id } }
                                 color='primary'
                                 preload={ false }>{ children }</Link>
    return <p>{ children }</p>
}, [ children, id, link ])
