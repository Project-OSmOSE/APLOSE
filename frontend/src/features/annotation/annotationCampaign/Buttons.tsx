import React, { Fragment } from "react";
import { IonIcon } from "@ionic/react";
import { helpBuoyOutline } from "ionicons/icons";
import { Link } from "@/components/ui";

export const AnnotationCampaignInstructionsButton: React.FC<{
  instructionsUrl?: string | null,
}> = ({ instructionsUrl }) => {
  if (!instructionsUrl) return <Fragment/>
  return <Link color='warning' fill='outline' href={ instructionsUrl }>
    <IonIcon icon={ helpBuoyOutline } slot="start"/>
    Instructions
  </Link>
}