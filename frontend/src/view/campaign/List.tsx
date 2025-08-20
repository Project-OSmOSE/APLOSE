import React, { Fragment, useEffect } from 'react';
import { IonIcon } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { ActionBar } from "@/components/layout";
import { Link } from "@/components/ui";
import { useFileFilters } from "@/service/slices/filter.ts";
import { Head } from "@/components/ui/Page.tsx";
import {
  AnnotationCampaignCardGrid,
  AnnotationCampaignFilters,
  useCampaignFilters
} from "@/features/annotation/annotationCampaign";


export const AnnotationCampaignList: React.FC = () => {
  const { params, updateParams } = useCampaignFilters()
  const { clearParams: clearFileFilters } = useFileFilters()

  useEffect(() => {
    clearFileFilters()
  }, []);

  return <Fragment>
    <Head title="Annotation Campaigns"/>

    <div style={ {
      height: '100%',
      display: 'grid',
      gap: '1rem',
      gridTemplateRows: 'auto 1fr',
      overflow: 'hidden'
    } }>
      <ActionBar search={ params.search }
                 searchPlaceholder="Search campaign name"
                 onSearchChange={ search => updateParams({ search }) }
                 actionButton={ <Link color='primary' fill='outline' appPath='/annotation-campaign/new'>
                   <IonIcon icon={ addOutline } slot="start"/>
                   New annotation campaign
                 </Link> }>
        <AnnotationCampaignFilters/>
      </ActionBar>

      <AnnotationCampaignCardGrid/>
    </div>
  </Fragment>
}
