import React, { Fragment, useCallback, useMemo } from 'react';
import { IonIcon, IonSkeletonText } from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons/index.js';
import { Button, Tab, useAlert, useModal } from '@/components/ui';
import { AnnotationPhaseType, useCurrentCampaign, useEndPhase } from '@/api';
import { AnnotationPhaseCreateAnnotationModal, AnnotationPhaseCreateVerificationModal } from './PhaseCreateModal'
import { useParams } from '@tanstack/react-router';

export const AnnotationPhaseTab: React.FC<{ phaseType: AnnotationPhaseType }> = ({ phaseType: phaseType }) => {
    const { campaignID, phaseType: currentPhaseType } = useParams({ strict: false });
    const { campaign, phases, isFetching } = useCurrentCampaign()
    const phase = useMemo(() => phases?.find(p => p.phase === phaseType), [ phases, phaseType ])

    const alert = useAlert();
    const verificationModal = useModal(AnnotationPhaseCreateVerificationModal);
    const annotationModal = useModal(AnnotationPhaseCreateAnnotationModal, {
        alsoCreateVerification: phaseType === AnnotationPhaseType.Verification,
    });

    const openModal = useCallback(() => {
        switch (phaseType) {
            case AnnotationPhaseType.Annotation:
                annotationModal.toggle()
                break;
            case AnnotationPhaseType.Verification:
                if (!phases) return;
                if (phases.find(p => p.phase === 'Annotation')) return verificationModal.toggle()
                else {
                    return alert.showAlert({
                        type: 'Warning',
                        message: 'A "Verification" phase is made to check results from the "Annotation" phase. ' +
                            'You must first create an "Annotation" phase, where you can either manually annotate your ' +
                            'dataset or directly import automatic detections.',
                        actions: [ {
                            label: 'Create an "Annotation" phase',
                            callback: annotationModal.toggle,
                        } ],
                    })
                }
        }
    }, [ phases, annotationModal, verificationModal, alert, phaseType ])

    const { endPhase } = useEndPhase()
    const end = useCallback(async () => {
        if (!phase || !campaignID) return;
        if (phase.completedTasksCount < phase.tasksCount) {
            // If annotators haven't finished yet, ask for confirmation
            return alert.showAlert({
                type: 'Warning',
                message: 'There is still unprocessed files.\nAre you sure you want to end this phase?',
                actions: [ {
                    label: 'End',
                    callback: () => endPhase({ id: phase.id, campaignID }),
                } ],
            });
        } else endPhase({ id: phase.id, campaignID })
    }, [ endPhase, phase, campaignID, alert ]);

    if (!campaign) return <Fragment/>
    if (isFetching)
        return <Tab to="/annotation-campaign/$campaignID/phase/$phaseType"
                    params={ { campaignID, phaseType } } active={ currentPhaseType === phaseType }>
            <IonSkeletonText animated style={ { width: 96 } }/>
        </Tab>
    if (phase)
        return <Tab to="/annotation-campaign/$campaignID/phase/$phaseType"
                    params={ { campaignID, phaseType } } active={ currentPhaseType === phaseType }>
            { phaseType }

            { campaign.isEditable && campaign.isUserAllowedToManage && currentPhaseType === phaseType && phase?.isOpen &&
                <IonIcon icon={ closeOutline } slot="end" onClick={ end }/> }
        </Tab>
    if (!campaign.isEditable || !campaign.isUserAllowedToManage) return <Fragment/>

    return <Fragment>
        <Button fill="clear" color="medium" onClick={ openModal }>
            { phaseType }
            <IonIcon icon={ addOutline } slot="end"/>
        </Button>

        { annotationModal.element }
        { verificationModal.element }
    </Fragment>
}