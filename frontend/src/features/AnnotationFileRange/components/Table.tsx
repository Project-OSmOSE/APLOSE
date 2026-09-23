import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { AddSquareLinearIcon, PenNewSquareLinearIcon, TrashBinMinimalistic2LinearIcon } from '@solar-icons/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Table, Tbody, Td, Th, Thead, Tr } from '@/components/ui';
import type { AnnotationCampaignNode, AnnotationPhaseNode } from '@/api/types.gql-generated';
import { Alert, Button, ButtonGroup, Dialog, Note, ProgressNote, Spinner, Toast } from '@/components/base';
import { Center } from '@/components/layout';
import * as API from '../api'
import { FileRangeForm } from './Form'
import styles from './styles.module.scss'
import { User } from '@/features/User';

type CampaignType = Pick<AnnotationCampaignNode, 'spectrogramsCount'>
type PhaseType = Pick<AnnotationPhaseNode, 'id'>

type FileRangeTableProps = {
    campaign: CampaignType;
    phase: PhaseType,
    filterAnnotators?: Pick<User.Fragment, 'id' | 'displayName'>[],
}
type AnnotatorData = {
    annotator: API.FileRangeFragment['annotator'],
    fileRanges: API.FileRangeFragment[]
}
type Row = [ string, AnnotatorData ]

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function rowAlphabeticalSort([ _a, dataA ]: Row, [ _b, dataB ]: Row): number {
    return dataA.annotator.displayName.localeCompare(dataB.annotator.displayName)
}

export const FileRangeTable: React.FC<FileRangeTableProps> = ({ campaign, phase, filterAnnotators }) => {
    const {
        data,
        isPending,
    } = useQuery(API.listFileRanges({ phaseID: phase.id }))

    const groupedFileRanges: Row[] = useMemo(() => {
        return [ ...data?.reduce((prev, fileRange) => {
            const prevFileRanges = prev.get(fileRange.annotator.id)?.fileRanges ?? [];
            prev.set(fileRange.annotator.id, {
                annotator: fileRange.annotator,
                fileRanges: [ ...prevFileRanges, fileRange ],
            });
            return prev
        }, new Map<string, AnnotatorData>()).entries() ?? [] ]
            .sort(rowAlphabeticalSort)
    }, [ data ])

    const filteredFileRanges: Row[] = useMemo(() => {
        if (!filterAnnotators) return groupedFileRanges
        return filterAnnotators.map(annotator =>
            groupedFileRanges.find(([ annotatorID ]) => annotator.id === annotatorID)
            ?? [ annotator.id, { annotator, fileRanges: [] } satisfies AnnotatorData ] satisfies Row
        ).sort(rowAlphabeticalSort)
    }, [ groupedFileRanges, filterAnnotators ]);

    if (isPending) return <Center><Spinner/></Center>
    return <Table className={ styles.Table }>
        <colgroup>
            <col/>
            <col/>
            <col/>
            <col/>
            <col/>
            <col/>
        </colgroup>
        <Thead>
            <Tr>
                <Th scope="col" start>Annotator</Th>
                <Th scope="col">Global progress<br/>Assigned</Th>
                <Th scope="col">First file</Th>
                <Th scope="col">Last file</Th>
                <Th scope="col">Progress</Th>
                <Th scope="col"></Th>
            </Tr>
        </Thead>
        { filteredFileRanges && filteredFileRanges.length === 0 && <Tbody>
            <Note color="medium">No annotators</Note>
        </Tbody> }
        { filteredFileRanges?.map(([ id, data ]) =>
            <FileRangeRow campaign={ campaign }
                          phase={ phase }
                          annotator={ data.annotator }
                          fileRanges={ data.fileRanges }
                          key={ id }/>) }
    </Table>
}

type FileRangeRowProps = AnnotatorData & {
    campaign: CampaignType;
    phase: PhaseType,
}
const FileRangeRow: React.FC<FileRangeRowProps> = ({ campaign, phase, fileRanges, annotator }) => {
    const [ isCreateOpen, setIsCreateOpen ] = useState<boolean>(false);
    const [ isCreating, setIsCreating ] = useState<boolean>(false);

    const globalProgress = useMemo(() => {
        if (!fileRanges) return 0
        if (fileRanges.length === 0) return 0
        const value = fileRanges.reduce((prev, range) =>
                prev + (range.completedAnnotationTasks?.totalCount ?? 0) / range.filesCount
            , 0)
        return value / fileRanges.length * 100
    }, [ fileRanges ])

    const assignedCount = useMemo(() => {
        return fileRanges?.reduce((prev, range) => prev + range.filesCount, 0) ?? 0
    }, [ fileRanges ])

    const rows = useMemo(() => {
        if (!fileRanges) return undefined
        if (assignedCount === campaign.spectrogramsCount) return fileRanges
        return [ ...fileRanges, 'add' as const ]
    }, [ fileRanges, assignedCount, campaign ])

    const onAdd = useCallback(() => {
        setIsCreateOpen(true)
    }, [])

    if (!rows)
        return <Tbody><Tr>
            <Th scope="row">{ annotator.displayName }</Th>
            <Td colSpan={ 5 }><Note color="danger">Cannot recover file ranges.</Note></Td>
        </Tr></Tbody>

    return <Tbody>
        { rows.map((row, i) => <Tr key={ i }>

            {/* Annotator */ }
            { i === 0 && <Th scope="row" rowSpan={ rows.length }>{ annotator.displayName }</Th> }

            {/* Global progress / Assigned */ }
            { i === 0 && <Td rowSpan={ rows.length }>
                <div className={ styles.assignedProgress }>
                    <ProgressNote value={ globalProgress }/>
                    <Note color={ assignedCount === 0 ? 'danger' : 'medium' }
                          data>{ assignedCount }/{ campaign.spectrogramsCount } assigned</Note>
                </div>
            </Td> }

            { row === 'add'
                ? <Td colSpan={ 4 }>
                    <ButtonGroup end>
                        { isCreating && <Spinner/> }
                        <Button disabled={ isCreating } onClick={ onAdd }>
                            Add file range <AddSquareLinearIcon size={ 20 }/>
                        </Button>
                    </ButtonGroup>
                </Td>
                : <Fragment>

                    {/* First file */ }
                    <Td center>
                        <Note data data-testid="firstFileIndex">
                            { row.firstFileIndex }
                        </Note>
                    </Td>

                    {/* Last file */ }
                    <Td center>
                        <Note data data-testid="lastFileIndex">
                            { row.lastFileIndex }
                        </Note>
                    </Td>

                    {/* Progress */ }
                    <Td center>
                        <div className={ styles.assignedProgress }>
                            <ProgressNote
                                value={ (row.completedAnnotationTasks?.totalCount ?? 0) / row.filesCount * 100 }/>
                            <Note color="medium"
                                  data>{ row.completedAnnotationTasks?.totalCount } / { row.filesCount }</Note>
                        </div>
                    </Td>

                    {/* Action */ }
                    <Td>
                        <ButtonGroup end>
                            <FileRangeAction fileRange={ row }
                                             allFileRanges={ fileRanges || [] }
                                             campaign={ campaign }
                                             phase={ phase }/>
                        </ButtonGroup>
                    </Td>
                </Fragment>
            }

        </Tr>) }

        <Dialog.Root open={ isCreateOpen } onOpenChange={ setIsCreateOpen }>
            <Dialog.Portal>
                <Dialog.Content>
                    <Dialog.Title>Update { annotator.displayName } file ranges</Dialog.Title>
                    <Dialog.CloseIcon/>

                    <FileRangeForm allFileRanges={ fileRanges }
                                   phase={ phase }
                                   annotator={ annotator }
                                   campaign={ campaign }
                                   onCancel={ () => setIsCreateOpen(false) }
                                   setIsPending={ setIsCreating }/>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    </Tbody>
}

type FileRangeActionProps = Omit<FileRangeRowProps, 'fileRanges' | 'annotator'> & {
    allFileRanges: API.FileRangeFragment[],
    fileRange: API.FileRangeFragment
}
const FileRangeAction: React.FC<FileRangeActionProps> = ({ fileRange, allFileRanges, campaign, phase }) => {
    const {
        mutateAsync: deleteMutationAsync,
        isPending: isDeleting,
    } = useMutation(API.deleteMutation)
    const [ isUpdateOpen, setIsUpdateOpen ] = useState<boolean>(false);
    const [ isUpdating, setIsUpdating ] = useState<boolean>(false);
    const toast = Toast.useToastManager()
    const alert = Alert.useManager()

    const isActionInProgress = useMemo(() => isUpdating || isDeleting, [ isUpdating, isDeleting ])

    const onEdit = useCallback(async () => {
        if (fileRange.completedAnnotationTasks?.totalCount) {
            const force = await alert.present({
                title: 'File range already started',
                message: 'The annotator already start annotating this file range. By updating it you may lost associated annotations.',
                buttons: [
                    {
                        type: 'Confirm',
                        confirmData: true,
                        text: 'Update and risk annotation loss',
                        color: 'danger',
                    },
                    {
                        type: 'Cancel',
                    },
                ],
            })
            if (!force) return
        }
        setIsUpdateOpen(true)
    }, [ fileRange, alert ])

    const onRemove = useCallback(async () => {
        if (fileRange.completedAnnotationTasks?.totalCount) {
            const force = await alert.present({
                title: 'File range already started',
                message: 'The annotator already start annotating this file range. By removing it you will lost all associated annotations.',
                buttons: [
                    {
                        type: 'Confirm',
                        confirmData: true,
                        text: 'Remove and lost annotations',
                        color: 'danger',
                    },
                    {
                        type: 'Cancel',
                    },
                ],
            })
            if (!force) return
        }
        try {
            await deleteMutationAsync({
                id: fileRange.id,
                phaseID: phase.id,
                annotatorID: fileRange.annotator.id,
            })
        } catch (error) {
            toast.addError({
                title: 'Error while removing file range',
                error,
            })
        }
    }, [ fileRange, phase, toast, alert, deleteMutationAsync ])

    return <Fragment>
        <Spinner hidden={ !isActionInProgress }/>
        <Button color="primary" disabled={ isActionInProgress }
                onClick={ onEdit }
                data-testid="edit">
            <PenNewSquareLinearIcon size={ 20 }/>
        </Button>
        <Button color="danger" disabled={ isActionInProgress }
                onClick={ onRemove }
                data-testid="remove">
            <TrashBinMinimalistic2LinearIcon size={ 20 }/>
        </Button>

        <Dialog.Root open={ isUpdateOpen } onOpenChange={ setIsUpdateOpen }>
            <Dialog.Portal>
                <Dialog.Content>
                    <Dialog.Title>Update { fileRange.annotator.displayName } file ranges</Dialog.Title>
                    <Dialog.CloseIcon/>

                    <FileRangeForm allFileRanges={ allFileRanges }
                                   fileRange={ fileRange }
                                   phase={ phase }
                                   annotator={ fileRange.annotator }
                                   campaign={ campaign }
                                   onCancel={ () => setIsUpdateOpen(false) }
                                   setIsPending={ setIsUpdating }/>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    </Fragment>
}
