import React, { Fragment, useMemo } from "react";
import { Link, TooltipOverlay } from "@/components/ui";
import { IonIcon } from "@ionic/react";
import { cloudDownloadOutline } from "ionicons/icons";
import { useParams } from "react-router-dom";
import { Phase } from "@/service/types";
import { useCurrentAnnotationCampaign } from "@/features/annotation/api";
import { AnnotationPhaseType } from "@/features/_utils_";


export const ImportAnnotationsButton: React.FC = () => {
  const { campaignID, phaseType } = useParams<{ campaignID: string; phaseType?: Phase; }>();
  const { phases } = useCurrentAnnotationCampaign()

  const path = useMemo(() => {
    return `/annotation-campaign/${ campaignID }/phase/${ phaseType }/import-annotations`
  }, [ campaignID, phaseType ])

  if (phaseType !== 'Annotation') return <Fragment/>
  if (!phases.some(p => p.phase === AnnotationPhaseType.Verification)) return <Fragment/>
  return <TooltipOverlay tooltipContent={ <p>Import annotations for verification</p> } anchor='right'>
    <Link appPath={ path } fill='outline' color='medium' aria-label='Import'>
      <IonIcon icon={ cloudDownloadOutline } slot='icon-only'/>
    </Link>
  </TooltipOverlay>
}
