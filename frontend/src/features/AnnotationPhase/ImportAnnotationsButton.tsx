import React, { Fragment } from 'react';
import { TooltipOverlay } from '@/components/ui';
import { AnnotationPhaseType } from '@/api';
import { useLoaderData, useParams } from '@tanstack/react-router';
import { Link } from '@/components/base/Button';
import { CloudUpload } from '@solar-icons/react';


export const ImportAnnotationsButton: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (phaseType !== AnnotationPhaseType.Verification) return <Fragment/>
    if (!phases.find(p => p.phase === AnnotationPhaseType.Verification)) return <Fragment/>
    return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor="right">
        <Link to="/annotation-campaign/$campaignID/phase/$phaseType/import-annotations"
              params={ { campaignID: campaign.id, phaseType: AnnotationPhaseType.Verification } }
              data-testid="import">
            <CloudUpload weight="Linear" size={ 24 }/>
        </Link>
    </TooltipOverlay>
}
