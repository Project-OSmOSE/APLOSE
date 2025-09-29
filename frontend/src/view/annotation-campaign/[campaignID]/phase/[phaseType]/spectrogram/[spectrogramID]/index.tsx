import React, { Fragment, useCallback, useEffect } from "react";
import styles from "./styles.module.scss";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useRetrieveCurrentPhase } from "@/service/api/campaign-phase.ts";
import { useAppDispatch } from "@/service/app.ts";
import { API } from "@/service/api";
import { Footer, Header } from "@/components/layout";
import { Link, Progress } from "@/components/ui";
import { IonIcon, IonNote } from "@ionic/react";
import { helpBuoyOutline } from "ionicons/icons";
import { IoCheckmarkCircleOutline, IoChevronForwardOutline } from "react-icons/io5";
import { Annotator, useAnnotatorNavigation, useAnnotatorQuery, useAnnotatorUI } from "@/features/Annotator";
import { AnnotationTaskStatus } from "@/features/_utils_/gql/types.generated.ts";

export const AnnotatorPage: React.FC = () => {
  const { campaignID, campaign } = useRetrieveCurrentCampaign()
  const { phaseType, phase } = useRetrieveCurrentPhase()
  const { data, canEdit } = useAnnotatorQuery();
  const dispatch = useAppDispatch()

  const { pointerPosition } = useAnnotatorUI()

  const { canNavigate } = useAnnotatorNavigation()

  useEffect(() => {
    if (pointerPosition) { // Disable scroll
      document.getElementsByTagName('html')[0].style.overflowY = 'hidden';
    } else { // Enable scroll
      document.getElementsByTagName('html')[0].style.overflowY = 'unset';
    }
  }, [ pointerPosition ]);

  const onBack = useCallback(() => {
    dispatch(API.util.invalidateTags([ {
      type: 'CampaignPhase',
      id: phase?.id
    } ]))
  }, [ phase ])

  // 'page' class is for playwright tests
  return <div className={ [ styles.page, 'page' ].join(' ') }>
    <Header size='small'
            canNavigate={ canNavigate }
            buttons={ <Fragment>

              { campaign?.instructions_url &&
                  <Link color='medium' target='_blank' href={ campaign?.instructions_url }>
                      <IonIcon icon={ helpBuoyOutline } slot='start'/>
                      Campaign instructions
                  </Link>
              }

              <Link color='medium' fill='outline' size='small'
                    onClick={ onBack }
                    appPath={ `/annotation-campaign/${ campaignID }/phase/${ phaseType }` }>
                Back to campaign
              </Link>
            </Fragment> }>
      { data && campaign && <div className={ styles.info }>
          <p>
            { campaign.name }
              <IoChevronForwardOutline/> { data.spectrogramById?.filename } { data.annotationTask?.status === AnnotationTaskStatus.Finished &&
              <IoCheckmarkCircleOutline/> }
          </p>
        { canEdit && data.annotationTaskIndexes?.total &&
            <Progress label='Position'
                      className={ styles.progress }
                      value={ (data.annotationTaskIndexes.current ?? 0) + 1 }
                      total={ data.annotationTaskIndexes.total }/> }
        { campaign?.archive ? <IonNote>You cannot annotate an archived campaign.</IonNote> :
          phase?.ended_by ? <IonNote>You cannot annotate an ended phase.</IonNote> :
            !data.annotationFileRange ? <IonNote>You are not assigned to annotate this file.</IonNote> :
              <Fragment/>
        }
      </div> }
    </Header>

    <Annotator/>

    <Footer/>
  </div>
}