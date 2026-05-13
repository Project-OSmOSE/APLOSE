import { createLazyFileRoute } from '@tanstack/react-router';
import React, { Fragment } from 'react';

import { Head } from '@/components/ui';

import { AnnotationCampaignListFilterActionBar, Cards } from '@/features/AnnotationCampaign';

const AnnotationCampaignList: React.FC = React.memo(() =>
    <Fragment>
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
)

export const Route = createLazyFileRoute('/_authenticated/annotation-campaign/')({
    component: AnnotationCampaignList,
})
