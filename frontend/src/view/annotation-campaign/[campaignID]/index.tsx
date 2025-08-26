import React, { Fragment, useCallback } from "react";
import styles from "./styles.module.scss";
import { Outlet } from "react-router-dom";
import { IonButton, IonIcon, IonSkeletonText } from "@ionic/react";
import { FadedText, Link, WarningText } from "@/components/ui";
import { Head } from "@/components/ui/Page.tsx";
import { dateToString, getErrorMessage } from "@/service/function.ts";
import { mailOutline } from "ionicons/icons";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useToast } from "@/service/ui";
import { CampaignPhaseTab } from "@/components/AnnotationCampaign/Phase";

export { AnnotationCampaignInfo } from './InfoTab'

export const AnnotationCampaignDetail: React.FC = () => {
  const {
    campaignID,
    campaign,
    error,
  } = useRetrieveCurrentCampaign();
  const { phase } = useRetrieveCurrentPhase()

  const toast = useToast();

  const copyOwnerMail = useCallback(async () => {
    if (!campaign) return;
    await navigator.clipboard.writeText(campaign.owner.email)
    toast.presentSuccess(`Successfully copy ${ campaign.owner.display_name } email address into the clipboard`)
  }, [ campaign?.owner.email ])

  if (!campaign) return <Fragment/>

  return <Fragment>

    <Head title={ campaign?.name } canGoBack
          subtitle={ campaign ? <FadedText>
              Created on { dateToString(campaign.created_at) } by { campaign.owner.display_name }
              { campaign.owner.email && <Fragment>
                  &nbsp;
                  <IonButton fill='clear' color='medium' size='small'
                             onClick={ copyOwnerMail } data-tooltip={ campaign.owner.email }>
                      <IonIcon icon={ mailOutline } slot='icon-only'/>
                  </IonButton>
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
            <Link appPath={ `/annotation-campaign/${ campaignID }` }
                  className={ !phase ? styles.active : undefined }>
                Information
            </Link>

            <CampaignPhaseTab phase='Annotation'/>
            <CampaignPhaseTab phase='Verification'/>
        </div>

        <Outlet/>
    </div> }
  </Fragment>
}
