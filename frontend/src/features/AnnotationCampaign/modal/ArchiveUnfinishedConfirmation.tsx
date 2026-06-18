import React from 'react';
import { Dialog } from '@/components/base/Dialog';
import { ButtonGroup } from '@/components/base/Button';

export type ArchiveUnfinishedConfirmationProps = {
    onConfirm?: () => void;
}
export const ArchiveUnfinishedConfirmation: React.FC<ArchiveUnfinishedConfirmationProps> = ({ onConfirm }) => {
    return <Dialog.Content alert>
        <Dialog.Title color='warning'>Unfinished campaign</Dialog.Title>
        <Dialog.Description>
            There is still unfinished annotations.<br/>
            Are you sure you want to archive this campaign?
        </Dialog.Description>

        <ButtonGroup end>
            <Dialog.Close>Cancel</Dialog.Close>
            <Dialog.Close color="warning" onClick={ onConfirm }>
                Archive
            </Dialog.Close>
        </ButtonGroup>
    </Dialog.Content>
}
