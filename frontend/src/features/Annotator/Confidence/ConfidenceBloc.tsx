import React, { Fragment } from 'react';
import { Bloc } from '@/components/ui';
import { ConfidenceChip } from './ConfidenceChip';
import { useLoaderData } from '@tanstack/react-router';
import { Popover } from '@/components/base/Popover';

export const ConfidenceBloc: React.FC = () => {
    const { campaign, confidences } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (!campaign.confidenceSet) return <Fragment/>
    return <Bloc.Root>
        <Popover.Root>
            <Popover.Trigger render={ <div/> } nativeButton={ false }>
                <Bloc.Title>Confidence indicator</Bloc.Title>
            </Popover.Trigger>
            <Popover.Content>
                <Popover.Title>Description</Popover.Title>
                { campaign.confidenceSet.desc }
            </Popover.Content>
        </Popover.Root>
        <Bloc.Content center>
            { confidences.map(c => <ConfidenceChip confidence={ c.label } key={ c.label }/>) }
        </Bloc.Content>
    </Bloc.Root>;
}
