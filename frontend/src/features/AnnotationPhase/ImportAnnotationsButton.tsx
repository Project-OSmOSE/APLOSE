import React, { Fragment } from 'react';
import { Link, TooltipOverlay } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { cloudUploadOutline } from 'ionicons/icons/index.js';
import { AnnotationPhaseType, useCurrentCampaign } from '@/api';
import { useParams } from '@tanstack/react-router';


export const ImportAnnotationsButton: React.FC = () => {
    const { campaignID, phaseType } = useParams({ strict: false });
    const { verificationPhase } = useCurrentCampaign()

    if (phaseType !== AnnotationPhaseType.Verification) return <Fragment/>
    if (!verificationPhase) return <Fragment/>
    return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor="right">
        <Link to="/annotation-campaign/$campaignID/phase/$phaseType/import-annotations"
              params={ { campaignID, phaseType: AnnotationPhaseType.Verification } } fill="outline" color="medium"
              data-testid="import">
            <IonIcon icon={ cloudUploadOutline } slot="icon-only"/>
        </Link>
    </TooltipOverlay>
}
