import React, { Fragment, useMemo } from "react";
import styles from "./styles.module.scss";
import { Outlet, useParams } from "react-router-dom";
import { IonSkeletonText } from "@ionic/react";
import { FadedText, Link, Progress, WarningText } from "@/components/ui";
import { Head } from "@/components/ui/Page.tsx";
import {
  AnnotationCampaignAnnotationType,
  AnnotationCampaignAPI,
  AnnotationCampaignArchiveButton,
  AnnotationCampaignCreation,
  AnnotationCampaignDeadline,
  AnnotationCampaignDescription,
  AnnotationCampaignInstructionsButton,
  AnnotationCampaignLabelsWithFeaturesModalButton,
  PhaseType
} from "@/features/annotation/annotationCampaign";
import { getErrorMessage, pluralize } from "@/service/function.ts";
import { ConfidenceSetDescription } from "@/features/annotation/confidenceSet";
import { SpectrogramAnalysisTable } from "@/features/data/spectrogramAnalysis";
import { DatasetName } from "@/features/data/dataset";
import { ArchiveDescription } from "@/features/common/archive";
import { LabelSetDescription } from "@/features/annotation/labelSet";
import { LabelsList } from "@/features/annotation/label";

export const AnnotationCampaignDetail: React.FC = () => {
  const { campaignID, phase } = useParams<{ campaignID: string; phase: string; }>();
  const { data: campaign, error } = AnnotationCampaignAPI.endpoints.getAnnotationCampaignByIDGlobal.useQuery({
    id: campaignID ?? '',
  }, { skip: !campaignID });

  const hasAnnotationPhase = useMemo(() => campaign?.phases?.results.find(p => p?.phase === PhaseType.annotation), [ campaign ])
  const hasVerificationPhase = useMemo(() => campaign?.phases?.results.find(p => p?.phase === PhaseType.verification), [ campaign ])

  return <Fragment>

    <Head title={ campaign?.name } canGoBack
          subtitle={ campaign ? <AnnotationCampaignCreation { ...campaign }/> :
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

            <Link
                appPath={ `/annotation-campaign/${ campaignID }/phase/${ PhaseType.annotation }` + (hasAnnotationPhase ? '' : '/new') }
                className={ phase === PhaseType.annotation ? styles.active : undefined }>
              { PhaseType.annotation }
            </Link>

          { (hasAnnotationPhase || hasVerificationPhase) &&
              <Link
                  appPath={ `/annotation-campaign/${ campaignID }/phase/${ PhaseType.verification }` + (hasVerificationPhase ? '' : '/new') }
                  className={ phase === PhaseType.verification ? styles.active : undefined }>
                { PhaseType.verification }
              </Link> }
        </div>

        <Outlet/>
    </div> }
  </Fragment>
}

export const AnnotationCampaignInfo: React.FC = () => {
  const { campaignID } = useParams<{ campaignID: string; }>();
  const { data: campaign } = AnnotationCampaignAPI.endpoints.getAnnotationCampaignByIDDetailed.useQuery({
    id: campaignID ?? '',
  }, { skip: !campaignID });

  const labelsWithAcousticFeatures = useMemo(() => {
    return campaign?.labelsWithAcousticFeatures?.results?.filter(l => l !== null) ?? []
  }, [ campaign ])

  if (!campaign) return <Fragment/>

  return <div className={ styles.info }>

    <AnnotationCampaignDescription { ...campaign }/>

    {/* GLOBAL */ }
    <div className={ styles.bloc }>
      <AnnotationCampaignArchiveButton { ...campaign }/>
      <ArchiveDescription { ...campaign.archive }/>
      <AnnotationCampaignInstructionsButton { ...campaign }/>
      <AnnotationCampaignDeadline { ...campaign }/>
    </div>

    {/* DATA */ }
    <div className={ styles.bloc }>
      <DatasetName { ...campaign.dataset } labeled link/>
      {/*<AnnotationCampaignAcquisitionModalButton/>*/ }
      <FadedText>Analysis</FadedText>
      <SpectrogramAnalysisTable annotationCampaignID={ campaignID }/>
    </div>

    {/* ANNOTATION */ }
    <div className={ styles.bloc }>
      <LabelSetDescription { ...campaign.labelSet }/>
      <div>
        <FadedText>Label{ pluralize(labelsWithAcousticFeatures) } with acoustic features</FadedText>
        <LabelsList results={ labelsWithAcousticFeatures }/>
      </div>
      <AnnotationCampaignLabelsWithFeaturesModalButton { ...campaign }/>
      <ConfidenceSetDescription { ...campaign.confidenceSet }/>
      <AnnotationCampaignAnnotationType { ...campaign }/>
    </div>

    {/* PROGRESS */ }
    <div className={ styles.bloc } style={ { maxWidth: 300 } }>
      { campaign.phases?.results.filter(p => p !== null).map(p =>
        <Progress key={ p.phase }
                  label={ p.phase }
                  value={ p.finishedTasksCount ?? 0 }
                  total={ p.tasksCount ?? 0 }/>) }
    </div>

  </div>
}