import React, { Fragment } from "react";
import styles from "./styles.module.scss";
import { Outlet } from "react-router-dom";
import { IonSkeletonText } from "@ionic/react";
import { FadedText, Link, WarningText } from "@/components/ui";
import { Head } from "@/components/ui/Page.tsx";
import { dateToString, getErrorMessage } from "@/service/function.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { PhaseTab } from "@/components/AnnotationCampaign/Phase";
import { MailButton } from "@/features/User";

export { AnnotationCampaignInfo } from './InfoTab'

export const AnnotationCampaignDetail: React.FC = () => {
  const {
    campaignID,
    campaign,
    error,
  } = useRetrieveCurrentCampaign();
  const { phaseType } = useRetrieveCurrentPhase()

  if (!campaign) return <Fragment/>
  return <Fragment>

    <Head title={ campaign?.name } canGoBack
          subtitle={ campaign ? <FadedText>
              Created on { dateToString(campaign.created_at) } by { campaign.owner.display_name }
              { campaign.owner.email && <Fragment>&nbsp;<MailButton user={ campaign.owner }/>
              </Fragment> }
            </FadedText> :
            <IonSkeletonText animated style={ { width: 512, height: '1ch', justifySelf: 'center' } }/> }/>

    { error && <WarningText>{ getErrorMessage(error) }</WarningText> }

    { campaign && <div style={ {
      height: '100%',
      display: 'grid',
      gap: '1rem',
      gridTemplateRows: 'auto 1fr',
      overflow: 'hidden'
    } }>

        <div className={ styles.tabs }>
            <Link appPath={ `/annotation-campaign/${ campaignID }` } replace
                  className={ !phaseType ? styles.active : undefined }>
                Information
            </Link>

            <PhaseTab phaseType='Annotation'/>
            <PhaseTab phaseType='Verification'/>
        </div>

        <Outlet/>
    </div> }
  </Fragment>
}
