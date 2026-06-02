import { createFileRoute, Outlet, useLoaderData, useParams } from '@tanstack/react-router'
import { AnnotationPhaseType } from '@/api';
import React, { Fragment, useMemo } from 'react';
import { FadedText, Head, Tab, Tabs } from '@/components/ui';
import { dateToString } from '@/service/function';
import { NBSP } from '@/service/type';
import { MailButton } from '@/features/User';
import { AnnotationPhaseTab } from '@/features/AnnotationPhase';

const AnnotationCampaignDetail: React.FC = () => {
    const { phaseType } = useParams({ strict: false });
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    return useMemo(() =>
            <Fragment>

                <Head title={ campaign.name } canGoBack
                      subtitle={ <FadedText>
                          Created on { dateToString(campaign.createdAt) } by { campaign.owner.displayName }
                          { campaign.owner.email && <Fragment>{ NBSP }<MailButton user={ campaign.owner }/>
                          </Fragment> }
                      </FadedText> }/>

                <div style={ {
                    height: '100%',
                    display: 'grid',
                    gap: '1rem',
                    gridTemplateRows: 'auto 1fr',
                    overflow: 'hidden',
                } }>

                    <Tabs>
                        <Tab to="/annotation-campaign/$campaignID" params={ { campaignID: campaign.id } }
                             active={ !phaseType }>
                            Information
                        </Tab>

                        <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Annotation }/>
                        <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Verification }/>
                    </Tabs>

                    <Outlet/>
                </div>
            </Fragment>,
        [ campaign, phaseType ])
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout')({
    component: AnnotationCampaignDetail,
})