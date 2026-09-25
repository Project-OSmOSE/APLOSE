import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { AnnotationCampaignNode, AnnotationPhaseNode } from '@/api/types.gql-generated';
import { Button, ButtonGroup, Field, Form, Spinner, Toast } from '@/components/base';
import * as API from '../api';
import { FileRangeDistribution } from './Distribution';
import styles from './styles.module.scss';


type FileRangeFormProps = {
    campaign: Pick<AnnotationCampaignNode, 'spectrogramsCount'>,
    phase: Pick<AnnotationPhaseNode, 'id'>,
    annotator: API.FileRangeFragment['annotator'],
    fileRange?: Pick<API.FileRangeFragment, 'id' | 'firstFileIndex' | 'lastFileIndex'>
    allFileRanges?: Pick<API.FileRangeFragment, 'id' | 'firstFileIndex' | 'lastFileIndex'>[],
    setIsPending?: (state: boolean) => void,
    onCancel: () => void,
    onSuccess: () => void,
}
export const FileRangeForm: React.FC<FileRangeFormProps> = ({
                                                                campaign,
                                                                phase,
                                                                annotator,
                                                                fileRange,
                                                                allFileRanges = [],
                                                                setIsPending,
                                                                onCancel,
                                                                onSuccess,
                                                            }) => {
    const {
        mutateAsync: updateMutationAsync,
        isPending: isUpdating,
    } = useMutation(API.updateMutation)
    const {
        mutateAsync: createMutationAsync,
        isPending: isCreating,
    } = useMutation(API.createMutation)
    const toast = Toast.useToastManager()
    useEffect(() => {
        setIsPending?.(isUpdating || isCreating)
    }, [ isUpdating, isCreating ]);

    const [ firstFileIndex, setFirstFileIndex ] = useState<number>(fileRange?.firstFileIndex ?? 1);
    const [ lastFileIndex, setLastFileIndex ] = useState<number>(fileRange?.lastFileIndex ?? campaign.spectrogramsCount);

    const otherFileRanges = useMemo(() => {
        return allFileRanges.filter(fr => fr.id !== fileRange?.id)
    }, [allFileRanges, fileRange])

    const create = useCallback(async () => {
        try {
            await createMutationAsync({
                annotatorID: annotator.id,
                annotatorDisplayName: annotator.displayName,
                phaseID: phase.id,
                input: {
                    firstFileIndex,
                    lastFileIndex,
                },
            })
            onSuccess()
        } catch (error) {
            toast.addError({ error, title: 'Error while creating file range' })
        }
    }, [ firstFileIndex, lastFileIndex, annotator, phase, createMutationAsync, onSuccess, toast ])

    const update = useCallback(async () => {
        if (!fileRange) return
        try {
            await updateMutationAsync({
                annotatorID: annotator.id,
                phaseID: phase.id,
                input: {
                    id: fileRange.id,
                    firstFileIndex,
                    lastFileIndex,
                },
            })
            onSuccess()
        } catch (error) {
            toast.addError({ error, title: 'Error while updating file range' })
        }
    }, [ firstFileIndex, lastFileIndex, annotator, fileRange, phase, updateMutationAsync, onSuccess, toast ])

    const submit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (fileRange) await update()
        else await create()
    }, [ fileRange, create, update ])

    return <Form onSubmit={ submit } onReset={ onCancel }>
        <div>
            { otherFileRanges && <FileRangeDistribution fileRanges={ otherFileRanges }
                                     spectrogramsCount={ campaign.spectrogramsCount }
                                     label="Assigned file ranges"
                                     color="medium"/> }
            <FileRangeDistribution fileRanges={ [ { firstFileIndex, lastFileIndex } ] }
                                   spectrogramsCount={ campaign.spectrogramsCount }
                                   label="Current range"
                                   color="primary"/>
        </div>

        <div className={ styles.RangeInput }>
            <Field.Root name="firstFileIndex">
                <Field.Label required>First file index</Field.Label>
                <Field.Control type="number"
                               required min={ 1 } max={ campaign.spectrogramsCount }
                               value={ firstFileIndex }
                               onValueChange={ value => setFirstFileIndex(+value) }/>
                <Field.Error/>
            </Field.Root>

            <Field.Root name="lastFileIndex">
                <Field.Label required>Last file index</Field.Label>
                <Field.Control type="number"
                               required min={ 1 } max={ campaign.spectrogramsCount }
                               value={ lastFileIndex }
                               onValueChange={ value => setLastFileIndex(+value) }/>
                <Field.Error/>
            </Field.Root>
        </div>

        <ButtonGroup spaceBetween>
            <Button disabled={ isUpdating || isCreating } type="reset">Cancel</Button>
            { (isUpdating || isCreating) && <Spinner/> }
            <Button disabled={ isUpdating || isCreating } type="submit">Save</Button>
        </ButtonGroup>
    </Form>
}