import React, { Fragment, useMemo } from "react";
import { Link, TooltipOverlay } from "@/components/ui";
import { IonIcon } from "@ionic/react";
import { cloudDownloadOutline } from "ionicons/icons";
import { useListPhasesForCurrentCampaign } from "@/service/api/campaign-phase.ts";
import { useParams } from "react-router-dom";
import { Phase } from "@/service/types";


export const ImportAnnotationsButton: React.FC = () => {
  const { campaignID, phaseType } = useParams<{ campaignID: string; phaseType?: Phase; }>();
  const { verificationPhase } = useListPhasesForCurrentCampaign()

  const path = useMemo(() => {
    return `/annotation-campaign/${ campaignID }/phase/${ phaseType }/import-annotations`
  }, [ campaignID, phaseType ])

  if (phaseType !== 'Annotation') return <Fragment/>
  if (!verificationPhase) return <Fragment/>
  return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor='right'>
    <Link appPath={ path } fill='outline' color='medium' aria-label='Import'>
      <IonIcon icon={ cloudDownloadOutline } slot='icon-only'/>
    </Link>
  </TooltipOverlay>
}
