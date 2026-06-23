import React, { Fragment } from 'react';
import { useLoaderData, useParams } from '@tanstack/react-router';
import { CloudUpload } from '@solar-icons/react';

import { AnnotationPhaseType } from '@/api';
import { Popover } from '@/components/base';


export const ImportAnnotationsButton: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (phaseType !== AnnotationPhaseType.Verification) return <Fragment/>
    if (!phases.find(p => p.phase === AnnotationPhaseType.Verification)) return <Fragment/>
    return <Popover.Root>
        <Popover.TriggerLink to="/annotation-campaign/$campaignID/phase/$phaseType/import-annotations"
                             params={ { campaignID: campaign.id, phaseType: AnnotationPhaseType.Verification } }
                             data-testid="import">
            <CloudUpload weight="Linear" size={ 24 }/>
        </Popover.TriggerLink>
        <Popover.Content>
            Import annotations for verification
        </Popover.Content>
    </Popover.Root>
}
