import React, { Fragment, useCallback, useMemo } from 'react';
import { IonIcon } from '@ionic/react';
import { addOutline, closeOutline } from 'ionicons/icons/index.js';
import { Button, Tab, useAlert, useModal } from '@/components/ui';
import { AnnotationPhaseType } from '@/api';
import { AnnotationPhaseCreateAnnotationModal, AnnotationPhaseCreateVerificationModal } from './PhaseCreateModal'
import { useLoaderData, useParams } from '@tanstack/react-router';
import { useMutation } from '@tanstack/react-query';
import { endMutation } from './api'
import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';

export const AnnotationPhaseTab: React.FC<{ phaseType: AnnotationPhaseType }> = ({ phaseType: phaseType }) => {
    const { phaseType: currentPhaseType } = useParams({ strict: false });
    const { campaign, phases } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
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

    const onSuccess = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: campaign.id }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
        queryClient.invalidateQueries({
            queryKey: queryKeys.phase.get({
                campaignID: campaign.id,
                phase: phaseType,
            }),
        })
    }, [ campaign, phaseType ])
    const { mutate: endPhase } = useMutation({
        ...endMutation,
        onSuccess,
    })
    const end = useCallback(async () => {
        if (!phase) return;
        if (phase.completedTasksCount < phase.tasksCount) {
            // If annotators haven't finished yet, ask for confirmation
            return alert.showAlert({
                type: 'Warning',
                message: 'There is still unprocessed files.\nAre you sure you want to end this phase?',
                actions: [ {
                    label: 'End',
                    callback: () => endPhase({ id: phase.id }),
                } ],
            });
        } else endPhase({ id: phase.id })
    }, [ endPhase, phase, campaign, alert ]);

    if (phase)
        return <Tab to="/annotation-campaign/$campaignID/phase/$phaseType"
                    params={ { campaignID: campaign.id, phaseType } } active={ currentPhaseType === phaseType }>
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