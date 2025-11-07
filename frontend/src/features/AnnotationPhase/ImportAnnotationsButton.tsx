import React, { Fragment, useMemo } from 'react';
import { Link, TooltipOverlay } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { cloudDownloadOutline } from 'ionicons/icons/index.js';
import { useCurrentCampaign } from '@/api';
import { type AploseNavParams } from '@/features/UX';
import { useParams } from 'react-router-dom';


export const ImportAnnotationsButton: React.FC = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const { verificationPhase } = useCurrentCampaign()

  const path = useMemo(() => {
    return `/annotation-campaign/${ campaignID }/phase/Annotation/import-annotations`
  }, [ campaignID ])

  if (phaseType !== 'Annotation') return <Fragment/>
  if (!verificationPhase) return <Fragment/>
  return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor="right">
    <Link appPath={ path } fill="outline" color="medium" data-testid="import">
      <IonIcon icon={ cloudDownloadOutline } slot="icon-only"/>
    </Link>
  </TooltipOverlay>
}
