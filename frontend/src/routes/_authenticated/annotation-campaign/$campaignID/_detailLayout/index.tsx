import React, { Fragment, useMemo } from 'react';
import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import { dateToString, pluralize } from '@/service/function';

import { LabelDialog } from '@/features/Labels';
import { CampaignComponents } from '@/features/AnnotationCampaign';
import { DatasetName } from '@/features/Dataset';
import { SpectrogramAnalysisTable } from '@/features/SpectrogramAnalysis';

import styles from './index.module.scss';
import { queryClient } from '@/api/queryClient';
import { SpectrogramAnalysis } from '@/features';
import { Note } from '@/components/base/Note';
import { Dialog } from '@/components/base/Dialog';

const AnnotationCampaignInfo: React.FC = () => {
    const analysis = Route.useLoaderData()
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    return useMemo(() => {
            return <div className={ styles.info }>
                { campaign.description && <div>
                    <Note color="medium">Description</Note>
                    <p>{ campaign.description }</p>
                </div> }

                {/* GLOBAL */ }
                <CampaignComponents.ArchiveButton/>
                <CampaignComponents.InstructionsButton instructionsUrl={ campaign.instructionsUrl }/>
                { campaign.archive && <Note color="medium">
                    Archived
                    on { dateToString(campaign.archive.date) } by { campaign.archive.byUser?.displayName }
                </Note> }
                { campaign.deadline && <div>
                    <Note color="medium">Deadline</Note>
                    <p>{ dateToString(campaign.deadline) }</p>
                </div> }

                {/* DATA */ }
                <div className={ styles.bloc }>
                    <Note color="medium">Dataset</Note>
                    <DatasetName name={ campaign.dataset.name } id={ campaign.dataset.id } link/>
                    {/*<AnnotationCampaignAcquisitionModalButton/>*/ }
                    <Note color="medium">Analysis</Note>
                    <SpectrogramAnalysisTable analysis={ analysis } spacing="small"/>
                </div>

                {/* ANNOTATION */ }
                { phases.length > 0 && <Fragment>
                    <div className={ styles.bloc }>
                        <div>
                            <Note color="medium">Label set</Note>
                            { campaign.labelSet && <Dialog.Root>
                                <Dialog.Trigger color="medium" disabled={ !campaign.labelSet }>
                                    { campaign.labelSet?.name ?? 'No label set' }
                                </Dialog.Trigger>
                                <LabelDialog.Set/>
                            </Dialog.Root> }
                        </div>
                    </div>

                    <div className={ styles.bloc }>
                        <div>
                            <Note color="medium">Confidence set</Note>
                            { !campaign.confidenceSet && <p>No confidence</p> }{ campaign.confidenceSet &&
                            <p>{ campaign.confidenceSet.name }</p> }
                        </div>
                        { campaign.confidenceSet && <div>
                            <Note color="medium">Indicator{ pluralize(campaign.confidenceSet.confidenceIndicators) }</Note>
                            <p>{ campaign.confidenceSet.confidenceIndicators?.map(i => i?.label).join(', ') }</p>
                        </div> }
                    </div>
                    <div className={ styles.bloc }>
                        <div><Note color="medium">Annotation types</Note><p>Weak,
                            box{ campaign.allowPointAnnotation ? ', point' : '' }</p>
                        </div>
                    </div>
                </Fragment> }

                {/* PROGRESS */ }
                <CampaignComponents.PhasesProgress campaign={ campaign }/>

            </div>
        }, [ campaign, phases, analysis ],
    )
}

export const Route = createFileRoute('/_authenticated/annotation-campaign/$campaignID/_detailLayout/')({
    loader: ({ params: { campaignID } }) => queryClient.ensureQueryData(SpectrogramAnalysis.API.allQuery({ annotationCampaignID: campaignID })),
    component: AnnotationCampaignInfo,
})
