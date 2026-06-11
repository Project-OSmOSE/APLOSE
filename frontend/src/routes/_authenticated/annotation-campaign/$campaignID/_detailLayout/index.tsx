import React, { Fragment, useMemo } from 'react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { IonButton } from '@ionic/react';

import { FadedText, Progress, useModal } from '@/components/ui';
import { dateToString, pluralize } from '@/service/function';

import { LabelSetModal } from '@/features/Labels';
import { AnnotationCampaignArchiveButton, AnnotationCampaignInstructionsButton } from '@/features/AnnotationCampaign';
import { DatasetName } from '@/features/Dataset';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';

import styles from './index.module.scss';
import { SpectrogramAnalysis } from '@/features';
import { ensureValidQueryData } from '@/api/utils';

const AnnotationCampaignInfo: React.FC = () => {
    const analysis = Route.useLoaderData()
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    const labelSetModal = useModal(LabelSetModal)

    return useMemo(() => {
        return <div className={ styles.info }>

            { campaign.description && <div><FadedText>Description</FadedText><p>{ campaign.description }</p></div> }

            {/* GLOBAL */ }
            <AnnotationCampaignArchiveButton/>
            <AnnotationCampaignInstructionsButton instructionsUrl={ campaign.instructionsUrl }/>
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
                <SpectrogramAnalysisTable analysis={ analysis }/>
            </div>

            {/* ANNOTATION */ }
            { phases.length > 0 && <Fragment>
                <div className={ styles.bloc }>
                    <div>
                        <FadedText>Label set</FadedText>
                        { campaign.labelSet && <IonButton fill="outline" color="medium" className="ion-text-wrap"
                                                          disabled={ !campaign.labelSet?.name }
                                                          onClick={ labelSetModal.toggle }>
                            { campaign.labelSet?.name ?? 'No label set' }
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
            { phases.map(p => <div key={ p!.id } className={ styles.bloc }>
                <FadedText>{ p!.phase } progress</FadedText>
                <Progress className={ styles.progress }
                          value={ p.completedTasksCount }
                          total={ p.tasksCount }/>
            </div>) }

            { labelSetModal.element }
        </div>
    }, [ campaign, phases, labelSetModal, analysis ])
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout/')({
    loader: ({ params: { campaignID } }) => ensureValidQueryData(SpectrogramAnalysis.API.allQuery({ annotationCampaignID: campaignID })),
    component: AnnotationCampaignInfo,
})
