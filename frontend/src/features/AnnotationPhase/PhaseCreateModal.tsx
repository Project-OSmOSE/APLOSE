import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useLoaderData, useNavigate } from '@tanstack/react-router';
import { IonSpinner } from '@ionic/react';
import { Modal, ModalHeader, WarningText } from '@/components/ui';
import { FormBloc, Input } from '@/components/form';
import { LabelSetSelect } from '@/features/Labels';
import { ConfidenceSetSelect } from '@/features/Confidence';
import { AnnotationLabelNode, AnnotationPhaseType, LabelSetNode, Maybe } from '@/api';
import styles from './styles.module.scss';
import { useMutation } from '@tanstack/react-query';
import { createAnnotationMutation, createVerificationMutation } from './api'
import { Button } from '@/components/base/Button';

type Label = Pick<AnnotationLabelNode, 'id' | 'name'>
type LabelSet = Pick<LabelSetNode, 'id' | 'description'> & {
    labels: Array<Maybe<Label>>;
}

export const AnnotationPhaseCreateAnnotationModal: React.FC<{
    onClose: () => void;
    alsoCreateVerification?: boolean
}> = ({ onClose, alsoCreateVerification }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const {
        isPending: isPostingAnnotationPhase,
        error: errorPostingAnnotationPhase,
        mutateAsync: createAnnotationPhase,
    } = useMutation(createAnnotationMutation)
    const {
        isPending: isPostingVerificationPhase,
        error: errorPostingVerificationPhase,
        mutateAsync: createVerificationPhase,
    } = useMutation(createVerificationMutation)
    const isPostingPhase = useMemo(() => isPostingAnnotationPhase || isPostingVerificationPhase, [ isPostingAnnotationPhase, isPostingVerificationPhase ])
    const error = useMemo(() => errorPostingAnnotationPhase ?? errorPostingVerificationPhase, [ errorPostingAnnotationPhase, errorPostingVerificationPhase ])
    const navigate = useNavigate()

    const [ labelSet, setLabelSet ] = useState<LabelSet | undefined>();
    const selectLabelSet = useCallback((labelSet?: LabelSet) => {
        setLabelSet(labelSet)
    }, []);

    const [ labelsWithAcousticFeatures, setLabelsWithAcousticFeatures ] = useState<Label[]>([]);
    const onLabelsWithFeaturesChange = useCallback((selection: Label[]) => {
        setLabelsWithAcousticFeatures(selection)
    }, [])

    const [ confidenceSetID, setConfidenceSetID ] = useState<string | undefined>();
    const selectConfidenceSetID = useCallback((id?: string) => {
        setConfidenceSetID(id)
    }, []);

    const [ allowPointAnnotation, setAllowPointAnnotation ] = useState<boolean>(false);
    const onAllowPointAnnotationChange = useCallback(() => {
        setAllowPointAnnotation(prev => !prev)
    }, [])


    const create = useCallback(async () => {
        if (!labelSet) return;
        await createAnnotationPhase({
            campaignID: campaign.id,
            labelSetID: labelSet.id,
            confidenceSetID,
            labelsWithAcousticFeatures: labelsWithAcousticFeatures.map(l => l.id),
            allowPointAnnotation,
        })
        if (alsoCreateVerification) {
            await createVerificationPhase({ campaignID: campaign.id })
        }
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType',
            params: {
                campaignID: campaign.id,
                phaseType: AnnotationPhaseType.Annotation,
            },
            search: { page: 1 },
        })
        onClose()
    }, [ navigate, campaign, onClose, labelSet, alsoCreateVerification, confidenceSetID, labelsWithAcousticFeatures, allowPointAnnotation, createAnnotationPhase, createVerificationPhase ])

    if (campaign.isArchived) return <Fragment/>
    return <Modal onClose={ onClose } className={ styles.modal }>
        <ModalHeader title="New annotation phase" onClose={ onClose }/>

        <div className={ styles.content }>
            <p>In an "Annotation" phase, you create new annotations.</p>


            <FormBloc>

                <LabelSetSelect placeholder="Select a label set"
                                selected={ labelSet }
                                onSelected={ selectLabelSet }
                                labelsWithAcousticFeatures={ labelsWithAcousticFeatures }
                                setLabelsWithAcousticFeatures={ onLabelsWithFeaturesChange }/>

                <ConfidenceSetSelect placeholder="Select a confidence set"
                                     selected={ confidenceSetID }
                                     onSelected={ selectConfidenceSetID }/>

                <Input type="checkbox"
                       label='Allow annotations of type "Point"'
                       checked={ allowPointAnnotation } onChange={ onAllowPointAnnotationChange }/>

            </FormBloc>

            { error && <WarningText error={ error }/> }
        </div>
        <div className={ styles.buttons }>
            <Button onClick={ onClose }>
                Cancel
            </Button>

            <div className={ styles.buttons }>
                { (isPostingPhase) && <IonSpinner/> }
                <Button color="primary"
                        disabled={ !labelSet }
                        onClick={ create }>
                    Create
                </Button>
            </div>
        </div>
    </Modal>
}

export const AnnotationPhaseCreateVerificationModal: React.FC<{
    onClose: () => void;
}> = ({ onClose }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const {
        isPending: isPostingPhase,
        error,
        mutateAsync: createVerificationPhase,
    } = useMutation(createVerificationMutation)
    const navigate = useNavigate()

    const create = useCallback(async () => {
        await createVerificationPhase({ campaignID: campaign.id })
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType',
            params: {
                campaignID: campaign.id,
                phaseType: AnnotationPhaseType.Verification,
            },
            search: { page: 1 },
        })
        onClose()
    }, [ campaign, createVerificationPhase, navigate, onClose ])

    const createAndImport = useCallback(async () => {
        await createVerificationPhase({ campaignID: campaign.id })
        navigate({
            to: '/annotation-campaign/$campaignID/phase/$phaseType/import-annotations',
            params: {
                campaignID: campaign.id,
                phaseType: AnnotationPhaseType.Annotation,
            },
        })
        onClose()
    }, [ campaign, createVerificationPhase, navigate, onClose ])

    if (campaign.isArchived) return <Fragment/>
    return <Modal onClose={ onClose } className={ styles.modal }>
        <ModalHeader title="New verification phase" onClose={ onClose }/>

        <div className={ styles.content }>
            <p>In a "Verification" phase, you can validate, reject, or add missing annotations.</p>
            <p>Annotations come from the "Annotation" phase and may be created manually or imported (e.g., from an
                automatic
                detector).</p>
            { error && <WarningText error={ error }/> }
        </div>

        <div className={ styles.buttons }>
            <Button onClick={ onClose }>
                Cancel
            </Button>

            <div className={ styles.buttons }>
                { isPostingPhase && <IonSpinner/> }
                <Button color="primary" onClick={ createAndImport }>
                    Create and import annotations
                </Button>
                <Button color="primary"
                        onClick={ create }>
                    Create
                </Button>
            </div>
        </div>
    </Modal>
}
