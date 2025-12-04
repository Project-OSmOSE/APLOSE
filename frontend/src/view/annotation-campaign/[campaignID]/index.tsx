import React, { Fragment } from 'react';
import styles from './styles.module.scss';
import { IonSkeletonText, IonSpinner } from '@ionic/react';
import { FadedText, Head, Link, WarningText } from '@/components/ui';
import { dateToString } from '@/service/function';
import { MailButton } from '@/features/User';
import { AnnotationPhaseTab } from '@/features/AnnotationPhase';
import { AnnotationPhaseType, useCurrentCampaign } from '@/api';
import { Outlet, useParams } from 'react-router-dom';
import { type AploseNavParams } from '@/features/UX';

export { AnnotationCampaignInfo } from './InfoTab'

export const AnnotationCampaignDetail: React.FC = () => {
  const { campaignID, phaseType } = useParams<AploseNavParams>();
  const {
    campaign,
    isFetching,
    error,
  } = useCurrentCampaign();

  return <Fragment>

    <Head title={ campaign?.name } canGoBack
          subtitle={ campaign ? <FadedText>
              Created on { dateToString(campaign.createdAt) } by { campaign.owner.displayName }
              { campaign.owner.email && <Fragment>&nbsp;<MailButton user={ campaign.owner }/>
              </Fragment> }
            </FadedText> :
            <IonSkeletonText animated style={ { width: 512, height: '1ch', justifySelf: 'center' } }/> }/>

    { isFetching && <IonSpinner/> }
    { error && <WarningText error={ error }/> }

    { campaign && <div style={ {
      height: '100%',
      display: 'grid',
      gap: '1rem',
      gridTemplateRows: 'auto 1fr',
      overflow: 'hidden',
    } }>

        <div className={ styles.tabs }>
            <Link appPath={ `/annotation-campaign/${ campaignID }` } replace
                  className={ !phaseType ? styles.active : undefined }>
                Information
            </Link>

            <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Annotation }/>
            <AnnotationPhaseTab phaseType={ AnnotationPhaseType.Verification }/>
        </div>

        <Outlet/>
    </div> }
  </Fragment>
}

export default AnnotationCampaignDetail
