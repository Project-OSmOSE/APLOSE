import React, { Fragment } from 'react';
import { Bloc } from '@/components/ui';
import { ConfidenceChip } from './ConfidenceChip';
import { useLoaderData } from '@tanstack/react-router';
import { Popover } from '@/components/base/Popover';

export const ConfidenceBloc: React.FC = () => {
    const { campaign, confidences } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (!campaign.confidenceSet) return <Fragment/>
    return <Popover.Root>
        <Popover.Trigger>
            <Bloc header="Confidence indicator"
                  centerBody>
                { confidences.map(c => <ConfidenceChip confidence={ c.label } key={ c.label }/>) }
            </Bloc>
        </Popover.Trigger>
        <Popover.Content>
            <Popover.Title>Description</Popover.Title>
            { campaign.confidenceSet.desc }
        </Popover.Content>
    </Popover.Root>
}
