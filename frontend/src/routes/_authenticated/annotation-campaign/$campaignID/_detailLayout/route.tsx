import { createFileRoute, Outlet, useLoaderData, useParams } from '@tanstack/react-router'
import React, { Fragment } from 'react';
import { dateToString } from '@/service/function';
import { NBSP } from '@/service/type';
import { Head, Tab, Tabs } from '@/components/ui';
import { Content, Page } from '@/components/layout';
import { User } from '@/features/User';
import { Phase } from '@/features/AnnotationPhase';

const AnnotationCampaignDetail: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    return <Page.Authenticated>
        <Content oneContent>

            <Head title={ campaign.name } canGoBack
                  subtitle={ <Fragment>
                      Created on { dateToString(campaign.createdAt) } by { campaign.owner.displayName }
                      { campaign.owner.email &&
                          <Fragment>{ NBSP }<User.CopyMailButton user={ campaign.owner }/>
                          </Fragment> }
                  </Fragment> }/>

            <Content oneContent inner>

                <Tabs>
                    <Tab to="/annotation-campaign/$campaignID" params={ { campaignID: campaign.id } }
                         active={ !phaseType }>
                        Information
                    </Tab>

                    <Phase.Tab phaseType={ Phase.Type.Annotation }/>
                    <Phase.Tab phaseType={ Phase.Type.Verification }/>
                </Tabs>

                <Outlet/>
            </Content>
        </Content>
    </Page.Authenticated>
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout')({
    loader: async ({ parentMatchPromise }) => (await parentMatchPromise).loaderData!,
    component: AnnotationCampaignDetail,
})