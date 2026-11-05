import React, { Fragment } from 'react';
import { useLoaderData, useParams } from '@tanstack/react-router';
import { CloudUploadLinearIcon } from '@solar-icons/react';
import { Phase } from '@/features/AnnotationPhase';
import { Popover } from '@/components/base';


export const ImportAnnotationsButton: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (phaseType !== Phase.Type.Verification) return <Fragment/>
    if (!phases.find(p => p.phase === Phase.Type.Verification)) return <Fragment/>
    return <Popover.Root>
        <Popover.TriggerLink to="/annotation-campaign/$campaignID/phase/$phaseType/import-annotations"
                             params={ { campaignID: campaign.id, phaseType: Phase.Type.Verification } }
                             data-testid="import">
            <CloudUploadLinearIcon size={ 24 }/>
        </Popover.TriggerLink>
        <Popover.Content>
            Import annotations for verification
        </Popover.Content>
    </Popover.Root>
}
