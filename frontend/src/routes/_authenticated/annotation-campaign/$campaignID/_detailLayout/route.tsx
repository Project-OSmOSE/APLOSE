import { createFileRoute, Outlet, useParams } from '@tanstack/react-router'
import { AnnotationPhaseType, useCurrentCampaign } from '@/api';
import React, { Fragment, useMemo } from 'react';
import { FadedText, GraphQLErrorText, Head, Tab, Tabs } from '@/components/ui';
import { dateToString } from '@/service/function';
import { NBSP } from '@/service/type';
import { MailButton } from '@/features/User';
import { IonSkeletonText, IonSpinner } from '@ionic/react';
import { AnnotationPhaseTab } from '@/features/AnnotationPhase';

const AnnotationCampaignDetail: React.FC = () => {
    const { campaignID, phaseType } = useParams({ strict: false });
    const {
        campaign,
        isFetching,
        error,
    } = useCurrentCampaign();

    return useMemo(() =>
            <Fragment>

                <Head title={ campaign?.name } canGoBack
                      subtitle={ campaign ? <FadedText>
                              Created on { dateToString(campaign.createdAt) } by { campaign.owner.displayName }
                              { campaign.owner.email && <Fragment>{ NBSP }<MailButton user={ campaign.owner }/>
                              </Fragment> }
                          </FadedText> :
                          <IonSkeletonText animated style={ { width: 512, height: '1ch', justifySelf: 'center' } }/> }/>

                { isFetching && <IonSpinner/> }
                { error && <GraphQLErrorText error={ error }/> }

                { campaign && <div style={ {
                    height: '100%',
                    display: 'grid',
                    gap: '1rem',
                    gridTemplateRows: 'auto 1fr',
                    overflow: 'hidden',
                } }>

                    <Tabs>
                        <Tab to="/annotation-campaign/$campaignID" params={ { campaignID } }
                             active={!phaseType}>
                            Information
                        </Tab>

                        <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Annotation }/>
                        <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Verification }/>
                    </Tabs>

                    <Outlet/>
                </div> }
            </Fragment>,
        [ campaign, campaignID, phaseType, isFetching, error ])
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout')({
    component: AnnotationCampaignDetail,
})