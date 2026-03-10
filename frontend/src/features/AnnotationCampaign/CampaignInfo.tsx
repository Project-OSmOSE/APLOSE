import React, { type ReactNode, useMemo } from 'react';
import { Link } from '@/components/ui';


export const CampaignName: React.FC<{
    children: ReactNode,
    id?: string
    link?: true
}> = ({ children, id, link }) => useMemo(() => {
    if (link && id) return <Link appPath={ `/annotation-campaign/${ id }/` } color="primary">{ children }</Link>
    return <p>{ children }</p>
}, [ children, id, link ])
