import React, { Fragment, useEffect } from 'react';
import { useFileFilters } from "@/service/slices/filter.ts";
import { Head } from "@/components/ui/Page.tsx";
import { Cards, ListActionBar } from "@/features/AnnotationCampaign";


export const AnnotationCampaignList: React.FC = () => {
  const { clearParams: clearFileFilters } = useFileFilters()

  useEffect(() => {
    clearFileFilters()
  }, []);

  return <Fragment>
    <Head title="Annotation campaigns"/>

    <div style={ {
      display: 'grid',
      maxHeight: '100%',
      gridTemplateRows: 'auto 1fr',
      overflow: "hidden",
      gap: '1rem',
    } }>

      <ListActionBar/>

      <Cards/>

    </div>
  </Fragment>
}
