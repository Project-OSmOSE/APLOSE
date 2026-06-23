import React, { Fragment, useCallback, useMemo, useState } from 'react';
import { useLoaderData } from '@tanstack/react-router';
import { Lock, TrashBinTrash } from '@solar-icons/react';

import { AnnotationFileRangeInput, ErrorType, UserNode } from '@/api';
import { Td, Th, Tr, useAlert } from '@/components/ui';
import { Button, ButtonGroup, Dialog, Field, Popover } from '@/components/base';

import { NBSP } from '@/service/type';

type FileRange = Omit<AnnotationFileRangeInput, 'id'> & {
    id: string;
    started?: boolean;
}
type Annotator = Pick<UserNode, 'id' | 'displayName' | 'expertise'>

export const FileRangeInputRow: React.FC<{
    range: FileRange,
    annotator: Annotator,
    onUpdate: (range: Partial<Pick<FileRange, 'firstFileIndex' | 'lastFileIndex'>>) => void;
    onDelete: (range: FileRange) => void;
    setForced?: () => void;
    errors?: Array<ErrorType>
}> = ({ range, annotator, onUpdate, onDelete, setForced, errors }) => {
    const { campaign } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })
    const [ isLocked, setIsLocked ] = useState<boolean>(range.started ?? false);
    const alert = useAlert();

    const unlock = useCallback(() => {
        setIsLocked(false)
        if (setForced) setForced()
    }, [ alert, setForced ])

    const firstFileIndexError = useMemo(() => errors?.find(e => e.field === 'firstFileIndex')?.messages.join(' '), [ errors ])
    const lastFileIndexError = useMemo(() => errors?.find(e => e.field === 'lastFileIndex')?.messages.join(' '), [ errors ])

    return <Tr>
        <Th scope="row">
            { annotator.displayName }{ NBSP }{ annotator.expertise &&
            <Fragment>( { annotator.expertise } )</Fragment> }
        </Th>
        <Td>
            <Field.Root>
                <Field.Control type="number"
                               placeholder="1"
                               data-testid="firstFileIndex"
                               value={ range.firstFileIndex ?? '' }
                               min={ 1 } max={ campaign.spectrogramsCount }
                               disabled={ campaign.spectrogramsCount === undefined || isLocked }
                               onValueChange={ value => onUpdate({ firstFileIndex: +value }) }/>
                { firstFileIndexError && <Field.Error> { firstFileIndexError }                </Field.Error> }
            </Field.Root>
        </Td>
        <Td>
            <Field.Root>
                <Field.Control type="number"
                               placeholder={ campaign.spectrogramsCount?.toString() }
                               data-testid="lastFileIndex"
                               value={ range.lastFileIndex ?? '' }
                               min={ 1 } max={ campaign.spectrogramsCount }
                               disabled={ campaign.spectrogramsCount === undefined || isLocked }
                               onValueChange={ value => onUpdate({ lastFileIndex: +value }) }/>
                { lastFileIndexError && <Field.Error> { lastFileIndexError }                </Field.Error> }
            </Field.Root>
        </Td>
        <Td>
            { isLocked ? <Dialog.Root>
                <Dialog.Trigger render={ <div/> } nativeButton={ false }>
                    <Popover.Root>
                        <Popover.Trigger color="medium" data-testid="unlock">
                            <Lock weight="Linear" size={ 20 }/>
                        </Popover.Trigger>
                        <Popover.Content>This user has already started to annotate</Popover.Content>
                    </Popover.Root>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Content alert>
                        <p>
                            This annotator has already started to annotated.<br/>
                            By updating its file range you could remove some annotations he/she made.<br/>
                            Are you sure?
                        </p>
                        <ButtonGroup end>
                            <Dialog.Close>Cancel</Dialog.Close>
                            <Dialog.Close color="warning" onClick={ unlock }>Update file range</Dialog.Close>
                        </ButtonGroup>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root> : <Button color="danger" data-testid="remove" onClick={ () => onDelete(range) }>
                <TrashBinTrash weight="Linear" size={ 20 }/>
            </Button> }
        </Td>
    </Tr>
}