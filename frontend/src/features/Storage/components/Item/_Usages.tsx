import React, { Fragment, useMemo } from 'react';
import { InfoCircle } from '@solar-icons/react';

import { TooltipOverlay } from '@/components/ui';

import type { StorageAnalysis, StorageDataset } from '../../types';

export const Usages: React.FC<{
    item: StorageAnalysis | StorageDataset
}> = ({ item }) => {
    return useMemo(() => {
            const usages = item.model?.annotationCampaigns.edges
                .map(e => e?.node)
                .filter(n => !!n && !n.isArchived).length ?? 0

            if (usages === 0) return <Fragment/>
            return <TooltipOverlay tooltipContent={ `Currently used in ${ usages } campaigns.` }>
                <InfoCircle size={ 24 } color="medium"/>
            </TooltipOverlay>
        },
        [ item ],
    )
}