import React, { Fragment } from "react";
import { IonSpinner } from "@ionic/react";

import { DatasetName, SpectrogramAnalysisTable } from "@/features/data/display";

import { AnnotationCampaignInstructionsButton } from "@/features/annotation/components";
import { FadedText, Progress } from "@/components/ui";
import { dateToString, pluralize } from "@/service/function.ts";
import { useGetLabelSetForCurrentCampaign } from "@/service/api/label-set.ts";
import { useGetConfidenceSetForCurrentCampaign } from "@/service/api/confidence-set.ts";
import { AnnotationCampaignArchiveButton } from "@/components/AnnotationCampaign";
import { LabelSetModalButton } from "@/components/AnnotationCampaign/Label/Modal.tsx";

import styles from "./styles.module.scss";
import { useCurrentAnnotationCampaign } from "@/features/annotation/api";


export const AnnotationCampaignInfo: React.FC = () => {
  const { campaign, phases } = useCurrentAnnotationCampaign()
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
      <DatasetName name={ campaign.dataset.name } pk={ campaign.dataset.id } labeled link/>
      {/*<AnnotationCampaignAcquisitionModalButton/>*/ }
      <FadedText>Analysis</FadedText>
      <SpectrogramAnalysisTable annotationCampaignPK={ campaign.id }/>
    </div>

    {/* ANNOTATION */ }
    { phases.length > 0 && <Fragment>
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
                      Label{ pluralize(campaign.labelsWithAcousticFeatures?.results) } with acoustic features
                  </FadedText>
                { campaign.labelsWithAcousticFeatures && campaign.labelsWithAcousticFeatures.results.filter(r => r !== null).length > 0 ?
                  <p>{ campaign.labelsWithAcousticFeatures?.results.filter(r => r !== null).map(l => l.name).join(', ') }</p>
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
    { phases && phases.map(p => <div key={ p.pk } className={ styles.bloc }>
      <FadedText>{ p.phase } progress</FadedText>
      <Progress className={ styles.progress }
                value={ p.completedTasksCount }
                total={ p.tasksCount }/>
    </div>) }
  </div>
}