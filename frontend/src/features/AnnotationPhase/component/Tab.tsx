import React, { Fragment, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AddCircle, CloseCircle } from '@solar-icons/react';

import { AnnotationPhaseType } from '@/api';
import { queryClient } from '@/api/queryClient';
import { queryKeys } from '@/api/queryKeys';
import { Tab as BaseTab } from '@/components/ui';
import { Button, ButtonGroup, Dialog } from '@/components/base';

import { CampaignAPI } from '@/features/AnnotationCampaign';

import { endMutation } from '../api'
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { CreateVerificationModal } from './CreateVerificationModal';

export const Tab: React.FC<{ phaseType: AnnotationPhaseType }> = ({ phaseType: phaseType }) => {
    const { phaseType: currentPhaseType } = useParams({ strict: false });
    const { campaignID } = useParams({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { data, isFetching } = useQuery(CampaignAPI.byIdQuery({ id: campaignID }))
    const navigate = useNavigate()
    const phase = useMemo(() => data?.phases?.find(p => p.phase === phaseType), [ data, phaseType ])
    const dialogRootRef = useRef<Dialog.RootActions | null>(null);

    const onSuccess = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.byId({ id: campaignID }) })
        queryClient.invalidateQueries({ queryKey: queryKeys.campaign.base })
        queryClient.invalidateQueries({ queryKey: queryKeys.phase.get({ campaignID, phase: phaseType }) })
    }, [ campaignID, phaseType ])
    const { mutate: endPhase } = useMutation({
        ...endMutation,
        onSuccess,
    })
    const end = useCallback(async () => {
        if (!phase) return;
        endPhase({ id: phase.id })
    }, [ endPhase, phase ]);

    const onAnnotationPhaseCreated = useCallback(() => {
        dialogRootRef.current?.close()
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType',
            params: { campaignID, phaseType: AnnotationPhaseType.Annotation },
            search: { page: 1 },
        })
    }, [ navigate, campaignID ])

    const onVerificationPhaseCreated = useCallback((shouldImport: boolean) => {
        dialogRootRef.current?.close()
        if (shouldImport) {
            navigate({
                to: '/annotation-campaign/$campaignID/phase/$phaseType/import-annotations',
                params: { campaignID, phaseType: AnnotationPhaseType.Verification },
            })
        } else {
            navigate({
                to: '/annotation-campaign/$campaignID/phase/$phaseType',
                params: { campaignID, phaseType: AnnotationPhaseType.Verification },
                search: { page: 1 },
            })
        }
    }, [ navigate, campaignID ])

    const endButton = useMemo(() => {
        if (!data?.campaign || !phase) return <Fragment/>
        if (!data.campaign.isEditable) return <Fragment/>
        if (!data.campaign.isUserAllowedToManage) return <Fragment/>
        if (!phase.isOpen) return <Fragment/>
        if (currentPhaseType !== phaseType) return <Fragment/>

        if (phase.completedTasksCount < phase.tasksCount) {
            return <Dialog.Root actionsRef={ dialogRootRef }>
                <Dialog.Trigger>
                    <CloseCircle weight="LineDuotone" size={ 20 }/>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Content alert>
                        <p>There is still unprocessed files.</p>
                        <p>Are you sure you want to end this phase?</p>
                        <ButtonGroup end>
                            <Dialog.Close>Cancel</Dialog.Close>
                            <Button color="warning" onClick={ end }>
                                End
                            </Button>
                        </ButtonGroup>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        }

        return <CloseCircle weight="LineDuotone" size={ 20 } onClick={ end }/>
    }, [ data, phase, currentPhaseType, end ])

    // Phase exists
    if (data?.campaign && phase) {
        return <BaseTab to="/annotation-campaign/$campaignID/phase/$phaseType"
                        disabled={ isFetching }
                        params={ { campaignID, phaseType } } active={ currentPhaseType === phaseType }>

            { phaseType }

            { endButton }
        </BaseTab>
    }

    // Phase does not exist -or- User cannot create
    if (!data?.campaign?.isEditable || !data?.campaign?.isUserAllowedToManage) return <Fragment/>

    // Create phase
    switch (phaseType) {
        case AnnotationPhaseType.Annotation:
            return <Fragment>
                <Dialog.Root actionsRef={ dialogRootRef }>
                    <Dialog.Trigger disabled={ isFetching }>
                        Annotation
                        <AddCircle weight="LineDuotone" size={ 20 }/>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <CreateAnnotationModal closeOnCreate={ onAnnotationPhaseCreated }/>
                    </Dialog.Portal>
                </Dialog.Root>
            </Fragment>
        case AnnotationPhaseType.Verification:
            return <Fragment>
                <Dialog.Root actionsRef={ dialogRootRef }>
                    <Dialog.Trigger disabled={ isFetching }>
                        Verification
                        <AddCircle weight="LineDuotone" size={ 20 }/>
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <CreateVerificationModal closeOnCreate={ onVerificationPhaseCreated }/>
                    </Dialog.Portal>
                </Dialog.Root>
            </Fragment>
    }
}