import React, { Fragment } from 'react';
import { Link, TooltipOverlay } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { cloudUploadOutline } from 'ionicons/icons/index.js';
import { AnnotationPhaseType } from '@/api';
import { useLoaderData, useParams } from '@tanstack/react-router';


export const ImportAnnotationsButton: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    if (phaseType !== AnnotationPhaseType.Verification) return <Fragment/>
    if (!phases.find(p => p.phase === AnnotationPhaseType.Verification)) return <Fragment/>
    return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor="right">
        <Link to="/annotation-campaign/$campaignID/phase/$phaseType/import-annotations"
              params={ { campaignID: campaign.id, phaseType: AnnotationPhaseType.Verification } } fill="outline"
              color="medium"
              data-testid="import">
            <IonIcon icon={ cloudUploadOutline } slot="icon-only"/>
        </Link>
    </TooltipOverlay>
}
