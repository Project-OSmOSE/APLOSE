import { createFileRoute, Outlet, useLoaderData, useParams } from '@tanstack/react-router'
import { AnnotationPhaseType } from '@/api';
import React, { Fragment } from 'react';
import { Head, Tab, Tabs } from '@/components/ui';
import { dateToString } from '@/service/function';
import { NBSP } from '@/service/type';
import { UserComponents } from '@/features/User';
import { AnnotationPhaseTab } from '@/features/AnnotationPhase';
import { Content } from '@/components/layout/Content';
import { Note } from '@/components/base/Note';

const AnnotationCampaignDetail: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    return <Content oneContent>

        <Head title={ campaign.name } canGoBack
              subtitle={ <Note color="medium" flex>
                  Created on { dateToString(campaign.createdAt) } by { campaign.owner.displayName }
                  { campaign.owner.email && <Fragment>{ NBSP }<UserComponents.CopyMailButton user={ campaign.owner }/>
                  </Fragment> }
              </Note> }/>

        <Content oneContent inner>

            <Tabs>
                <Tab to="/annotation-campaign/$campaignID" params={ { campaignID: campaign.id } }
                     active={ !phaseType }>
                    Information
                </Tab>

                <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Annotation }/>
                <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Verification }/>
            </Tabs>

            <Outlet/>
        </Content>
    </Content>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout')({
    component: AnnotationCampaignDetail,
})