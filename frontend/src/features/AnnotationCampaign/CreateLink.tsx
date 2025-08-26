import { IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { Link } from "@/components/ui";
import React from "react";

export const CreateLink: React.FC = () => (
  <Link color='primary'
        fill='outline'
        appPath='/annotation-campaign/new'>
    <IonIcon icon={ addOutline } slot="start"/>
    New annotation campaign
  </Link>
)
