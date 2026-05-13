import React, { Fragment, useMemo } from 'react';
import { createLazyFileRoute, Outlet, useParams } from '@tanstack/react-router';
import { IonSkeletonText, IonSpinner } from '@ionic/react';

import { FadedText, GraphQLErrorText, Head, Link } from '@/components/ui';

import { AnnotationPhaseType, useCurrentCampaign } from '@/api';
import { dateToString } from '@/service/function';
import { NBSP } from '@/service/type';

import { MailButton } from '@/features/User';
import { AnnotationPhaseTab } from '@/features/AnnotationPhase';

import styles from './$campaignID.module.scss';

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

                    <div className={ styles.tabs }>
                        <Link to="/annotation-campaign/$campaignID" params={ { campaignID } } replace
                              className={ !phaseType ? styles.active : undefined }>
                            Information
                        </Link>

                        <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Annotation }/>
                        <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Verification }/>
                    </div>

                    <Outlet/>
                </div> }
            </Fragment>,
        [ campaign, campaignID, phaseType, isFetching, error ])
}

export const Route = createLazyFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout')({
    component: AnnotationCampaignDetail,
})
