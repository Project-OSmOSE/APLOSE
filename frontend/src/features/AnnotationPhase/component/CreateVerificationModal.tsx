import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { useMutation, useQuery } from '@tanstack/react-query';

import { AnnotationPhaseType } from '@/api';
import { Button, ButtonGroup, Dialog, Spinner, Toast } from '@/components/base';

import { CampaignAPI } from '@/features/AnnotationCampaign';

import { createVerificationMutation } from '../api'
import { CreateAnnotationModal } from './CreateAnnotationModal';

export const CreateVerificationModal: React.FC<{
    closeOnCreate: (shouldImport: boolean) => void
}> = ({ closeOnCreate }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const { data } = useQuery(CampaignAPI.byIdQuery({ id: campaign?.id }))
    const {
        isPending,
        mutateAsync: createVerificationPhase,
    } = useMutation(createVerificationMutation)
    const navigate = useNavigate()
    const toastManager = Toast.useToastManager()

    const annotationPhaseExists = useMemo(() => data?.phases.find(p => p.phase === AnnotationPhaseType.Annotation), [ data ])

    const [ shouldImport, setShouldImport ] = useState<boolean>(false);

    const create = useCallback(async () => {
        try {
            await createVerificationPhase({ campaignID: campaign.id })
            closeOnCreate(shouldImport)
            navigate({
                to: '/annotation-campaign/$campaignID/phase/$phaseType',
                params: {
                    campaignID: campaign.id,
                    phaseType: AnnotationPhaseType.Verification,
                },
                search: { page: 1 },
            })
        } catch (error) {
            toastManager.addError({ title: 'Verification phase creation failed', error })
        }
    }, [ campaign, createVerificationPhase, navigate, toastManager, shouldImport, closeOnCreate ])

    const createAndImport = useCallback(async () => {
        try {
            await createVerificationPhase({ campaignID: campaign.id })
            navigate({
                to: '/annotation-campaign/$campaignID/phase/$phaseType/import-annotations',
                params: {
                    campaignID: campaign.id,
                    phaseType: AnnotationPhaseType.Annotation,
                },
            })
        } catch (error) {
            toastManager.addError({ title: 'Verification phase creation failed', error })
        }
    }, [ campaign, createVerificationPhase, navigate, toastManager ])

    const rootRef = useRef<Dialog.RootActions | null>(null);

    const createButtons = useMemo(() => {
        if (annotationPhaseExists) {
            return <ButtonGroup end>
                <Button color="primary" onClick={ createAndImport }>
                    Create and import annotations
                </Button>
                <Button color="primary" onClick={ create }>
                    Create
                </Button>
            </ButtonGroup>
        } else {
            // Annotation phase needs to be created
            return <Fragment>
                <ButtonGroup end>
                    <Dialog.Root actionsRef={ rootRef }>
                        <Dialog.Trigger color="primary" onClick={ () => setShouldImport(true) }>
                            Create and import annotations
                        </Dialog.Trigger>
                        <Dialog.Trigger color="primary" onClick={ () => setShouldImport(false) }>
                            Create
                        </Dialog.Trigger>
                        <Dialog.Portal>
                            <CreateAnnotationModal closeOnCreate={ () => {
                                rootRef.current?.close()
                                create()
                            } }/>
                        </Dialog.Portal>
                    </Dialog.Root>
                </ButtonGroup>
            </Fragment>
        }
    }, [ annotationPhaseExists, create, createAndImport, rootRef ])

    if (campaign.isArchived) return <Fragment/>
    return <Dialog.Content>
        <Dialog.Title>New verification phase</Dialog.Title>
        <Dialog.CloseIcon/>

        <p>In a "Verification" phase, you can validate, reject, or add missing annotations.</p>
        <p>
            Annotations come from the "Annotation" phase and may be created manually or imported (e.g., from an
            automatic detector).
        </p>
        { !annotationPhaseExists && <p>
            A "Verification" phase is made to check results from the "Annotation" phase.
            You must first create an "Annotation" phase, where you can either manually annotate your dataset or directly
            import automatic detections.
        </p> }

        <ButtonGroup spaceBetween>
            <Dialog.Close>Cancel</Dialog.Close>

            { isPending && <Spinner/> }

            { createButtons }
        </ButtonGroup>
    </Dialog.Content>
}
