import React, { Fragment } from "react";
import { AnnotationCampaignInstructionsButton } from "@/features/annotation/annotationCampaign";
import styles from "./styles.module.scss";
import { DatasetName } from "@/features/data/dataset";
import { FadedText, Progress } from "@/components/ui";
import { SpectrogramAnalysisTable } from "@/features/data/spectrogramAnalysis";
import { dateToString, pluralize } from "@/service/function.ts";
import { useRetrieveCurrentCampaign } from "@/service/api/campaign.ts";
import { useListPhasesForCurrentCampaign } from "@/service/api/campaign-phase.ts";
import { useGetLabelSetForCurrentCampaign } from "@/service/api/label-set.ts";
import { useGetConfidenceSetForCurrentCampaign } from "@/service/api/confidence-set.ts";
import { AnnotationCampaignArchiveButton } from "@/components/AnnotationCampaign";
import { IonSpinner } from "@ionic/react";
import { LabelSetModalButton } from "@/components/AnnotationCampaign/Label/Modal.tsx";


export const AnnotationCampaignInfo: React.FC = () => {
  const { campaign } = useRetrieveCurrentCampaign()
  const { phases } = useListPhasesForCurrentCampaign()
  const { labelSet, isLoading: isLoadingLabelSet } = useGetLabelSetForCurrentCampaign();
  const { confidenceSet, isLoading: isLoadingConfidenceSet } = useGetConfidenceSetForCurrentCampaign();

  if (!campaign) return <Fragment/>
  return <div className={ styles.info }>

    { campaign.desc && <div><FadedText>Description</FadedText><p>{ campaign.desc }</p></div> }

    {/* GLOBAL */ }
    <AnnotationCampaignArchiveButton/>
    { campaign.archive && <FadedText>
        Archived
        on { dateToString(campaign.archive.date) } by { campaign.archive?.by_user.display_name }
    </FadedText> }
    <AnnotationCampaignInstructionsButton/>
    { campaign.deadline && <div>
        <FadedText>Deadline</FadedText>
        <p>{ dateToString(campaign.deadline) }</p>
    </div> }

    {/* DATA */ }
    <div className={ styles.bloc }>
      <DatasetName { ...campaign.dataset } labeled link/>
      {/*<AnnotationCampaignAcquisitionModalButton/>*/ }
      <FadedText>Analysis</FadedText>
      <SpectrogramAnalysisTable annotationCampaignID={ campaign.id.toString() }/>
    </div>

    {/* ANNOTATION */ }
    { campaign?.phases.length > 0 && <Fragment>
        <div className={ styles.bloc }>
          { (isLoadingLabelSet || isLoadingConfidenceSet) && <IonSpinner/> }
          { !isLoadingLabelSet && <Fragment>
              <div>
                  <FadedText>Label set</FadedText>
                { labelSet ? <p>{ labelSet.name }</p> : <p>No label set</p> }
              </div>
            { labelSet && <div>
                <FadedText>Label{ pluralize(labelSet.labels) }</FadedText>
                <p>{ labelSet.labels.join(', ') }</p>
            </div> }
              <div>
                  <FadedText>
                      Label{ pluralize(campaign.labels_with_acoustic_features) } with acoustic features
                  </FadedText>
                { campaign.labels_with_acoustic_features.length > 0 ?
                  <p>{ campaign.labels_with_acoustic_features.join(', ') }</p>
                  : <p>No labels with features</p> }
              </div>
          </Fragment> }
          { labelSet && <LabelSetModalButton/> }
        </div>

        <div className={ styles.bloc }>
          { !isLoadingConfidenceSet && <Fragment>
              <div>
                  <FadedText>Confidence indicator set</FadedText>
                { !confidenceSet && <p>No confidence</p> }{ confidenceSet && <p>{ confidenceSet.name }</p> }
              </div>
            { confidenceSet && <div>
                <FadedText>Indicator{ pluralize(confidenceSet.confidence_indicators) }</FadedText>
                <p>{ confidenceSet.confidence_indicators.map(i => i.label).join(', ') }</p>
            </div> }
          </Fragment> }
        </div>
        <div className={ styles.bloc }>
            <div><FadedText>Annotation types</FadedText><p>Weak,
                box{ campaign.allow_point_annotation ? ', point' : '' }</p>
            </div>
        </div>
    </Fragment> }

    {/* PROGRESS */ }
    { phases && phases.map(p => <div key={ p.id } className={ styles.bloc }>
      <FadedText>{ p.phase } progress</FadedText>
      <Progress className={ styles.progress }
                value={ p.global_progress }
                total={ p.global_total }/>
    </div>) }
  </div>
}