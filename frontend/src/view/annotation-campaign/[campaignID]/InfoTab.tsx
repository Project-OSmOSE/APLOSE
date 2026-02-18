import React, { Fragment } from 'react';

import { DatasetName } from '@/features/Dataset';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';
import { AnnotationCampaignArchiveButton, AnnotationCampaignInstructionsButton } from '@/features/AnnotationCampaign';
import { FadedText, Progress, useModal } from '@/components/ui';
import { dateToString, pluralize } from '@/service/function';
import { LabelSetModal } from '@/features/Labels';
import { useCurrentCampaign } from '@/api';

import styles from './styles.module.scss';
import { IonButton } from '@ionic/react';


export const AnnotationCampaignInfo: React.FC = () => {
    const { campaign, phases } = useCurrentCampaign()

    const labelSetModal = useModal(LabelSetModal)

    if (!campaign) return <Fragment/>
    return <div className={ styles.info }>

        { campaign.description && <div><FadedText>Description</FadedText><p>{ campaign.description }</p></div> }

        {/* GLOBAL */ }
        <AnnotationCampaignArchiveButton/>
        <AnnotationCampaignInstructionsButton/>
        { campaign.archive && <FadedText>
            Archived
            on { dateToString(campaign.archive.date) } by { campaign.archive.byUser?.displayName }
        </FadedText> }
        { campaign.deadline && <div>
            <FadedText>Deadline</FadedText>
            <p>{ dateToString(campaign.deadline) }</p>
        </div> }

        {/* DATA */ }
        <div className={ styles.bloc }>
            <DatasetName name={ campaign.dataset.name } id={ campaign.dataset.id } labeled link/>
            {/*<AnnotationCampaignAcquisitionModalButton/>*/ }
            <FadedText>Analysis</FadedText>
            <SpectrogramAnalysisTable annotationCampaignID={ campaign.id }/>
        </div>

        {/* ANNOTATION */ }
        { phases && phases.length > 0 && campaign && <Fragment>
            <div className={ styles.bloc }>
                <div>
                    <FadedText>Label set</FadedText>
                    { campaign?.labelSet && <IonButton fill="outline" color="medium" className="ion-text-wrap"
                                                       disabled={ !campaign?.labelSet?.name }
                                                       onClick={ labelSetModal.toggle }>
                        { campaign?.labelSet?.name ?? 'No label set' }
                    </IonButton> }
                </div>
            </div>

            <div className={ styles.bloc }>
                <div>
                    <FadedText>Confidence set</FadedText>
                    { !campaign.confidenceSet && <p>No confidence</p> }{ campaign.confidenceSet &&
                    <p>{ campaign.confidenceSet.name }</p> }
                </div>
                { campaign.confidenceSet && <div>
                    <FadedText>Indicator{ pluralize(campaign.confidenceSet.confidenceIndicators) }</FadedText>
                    <p>{ campaign.confidenceSet.confidenceIndicators?.map(i => i?.label).join(', ') }</p>
                </div> }
            </div>
            <div className={ styles.bloc }>
                <div><FadedText>Annotation types</FadedText><p>Weak,
                    box{ campaign.allowPointAnnotation ? ', point' : '' }</p>
                </div>
            </div>
        </Fragment> }

        {/* PROGRESS */ }
        { phases && phases.map(p => <div key={ p!.id } className={ styles.bloc }>
            <FadedText>{ p!.phase } progress</FadedText>
            <Progress className={ styles.progress }
                      value={ p.completedTasksCount }
                      total={ p.tasksCount }/>
        </div>) }

        { labelSetModal.element }
    </div>
}

export default AnnotationCampaignInfo
