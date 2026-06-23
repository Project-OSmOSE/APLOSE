import { createFileRoute, Outlet, useLoaderData, useParams } from '@tanstack/react-router'
import { AnnotationPhaseType } from '@/api';
import React, { Fragment } from 'react';
import { Head, Tab, Tabs } from '@/components/ui';
import { dateToString } from '@/service/function';
import { NBSP } from '@/service/type';
import { UserComponent } from '@/features/User';
import { PhaseComponent } from '@/features/AnnotationPhase';
import { Content } from '@/components/layout/Content';

const AnnotationCampaignDetail: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    return <Content oneContent>

        <Head title={ campaign.name } canGoBack
              subtitle={ <Fragment>
                  Created on { dateToString(campaign.createdAt) } by { campaign.owner.displayName }
                  { campaign.owner.email && <Fragment>{ NBSP }<UserComponent.CopyMailButton user={ campaign.owner }/>
                  </Fragment> }
              </Fragment> }/>

        <Content oneContent inner>

            <Tabs>
                <Tab to="/annotation-campaign/$campaignID" params={ { campaignID: campaign.id } }
                     active={ !phaseType }>
                    Information
                </Tab>

                <PhaseComponent.Tab phaseType={ AnnotationPhaseType.Annotation }/>
                <PhaseComponent.Tab phaseType={ AnnotationPhaseType.Verification }/>
            </Tabs>

            <Outlet/>
        </Content>
    </Content>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout')({
    component: AnnotationCampaignDetail,
})