import React from 'react';
import { Dialog } from '@/components/base/Dialog';
import { ButtonGroup } from '@/components/base/Button';

export type ArchiveEmptyConfirmationProps = {
    onConfirm?: () => void;
}
export const ArchiveEmptyConfirmation: React.FC<ArchiveEmptyConfirmationProps> = ({ onConfirm }) => {
    return <Dialog.Content alert>
        <Dialog.Title color='warning'>Empty campaign</Dialog.Title>
        <Dialog.Description>
            The campaign is empty.<br/>
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
