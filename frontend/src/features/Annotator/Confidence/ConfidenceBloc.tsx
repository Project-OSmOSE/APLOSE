import React, { Fragment } from 'react';
import { Bloc, TooltipOverlay } from '@/components/ui';
import { ConfidenceChip } from './ConfidenceChip';
import { useLoaderData } from '@tanstack/react-router';

export const ConfidenceBloc: React.FC = () => {
    const { campaign, confidences } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (!campaign.confidenceSet) return <Fragment/>
    return <TooltipOverlay title="Description"
                           tooltipContent={ campaign.confidenceSet.desc }>
        <Bloc header="Confidence indicator"
              centerBody>
            { confidences.map(c => <ConfidenceChip confidence={ c.label } key={ c.label }/>) }
        </Bloc>
    </TooltipOverlay>
}
