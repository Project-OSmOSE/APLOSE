import React, { Fragment } from 'react';
import { Head } from '@/components/ui';
import { AnnotationCampaignListFilterActionBar, Cards } from '@/features/AnnotationCampaign';


export const AnnotationCampaignList: React.FC = () => {

  return <Fragment>
    <Head title="Annotation campaigns"/>

    <div style={ {
      display: 'grid',
      maxHeight: '100%',
      gridTemplateRows: 'auto 1fr',
      overflow: 'hidden',
      gap: '1rem',
    } }>

      <AnnotationCampaignListFilterActionBar/>

      <Cards/>

    </div>
  </Fragment>
}
