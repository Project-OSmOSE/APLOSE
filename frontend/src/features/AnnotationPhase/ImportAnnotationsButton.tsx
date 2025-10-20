import React, { Fragment, useMemo } from 'react';
import { Link, TooltipOverlay } from '@/components/ui';
import { IonIcon } from '@ionic/react';
import { cloudDownloadOutline } from 'ionicons/icons/index.js';
import { useCurrentCampaign } from '@/api';
import { useNavParams } from '@/features/UX';


export const ImportAnnotationsButton: React.FC = () => {
  const { campaignID, phaseType } = useNavParams();
  const { verificationPhase } = useCurrentCampaign()

  const path = useMemo(() => {
    return `/annotation-campaign/${ campaignID }/phase/Annotation/import-annotations`
  }, [ campaignID ])

  if (phaseType !== 'Annotation') return <Fragment/>
  if (!verificationPhase) return <Fragment/>
  return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor="right">
    <Link appPath={ path } fill="outline" color="medium" aria-label="Import">
      <IonIcon icon={ cloudDownloadOutline } slot="icon-only"/>
    </Link>
  </TooltipOverlay>
}
