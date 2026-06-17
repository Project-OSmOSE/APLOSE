import React from 'react';
import { Modal, ModalHeader, type ModalProps } from '@/components/ui';
import styles from './styles.module.scss';
import { useLoaderData } from '@tanstack/react-router';
import { Button } from '@/components/base/Button';
import { Note } from '@/components/base/Note';

export const UpdateLabelModal: React.FC<ModalProps & {
    selected?: string,
    onUpdate: (label: string) => void;
}> = ({ onClose, selected, onUpdate }) => {
    const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

    return <Modal onClose={ onClose }>
        <ModalHeader title="Update annotation label" onClose={ onClose }/>
        <Note>Choose a new label</Note>
        <div className={ styles.labelsButtons }>
            { labels.map((label, index) => <Button key={ label.id }
                                                   disabled={ label.name === selected }
                                                   className={ `ion-color-${ index % 10 }` }
                                                   onClick={ () => {
                                                       onUpdate(label.name)
                                                       onClose()
                                                   } }>
                { label.name }
            </Button>) }
        </div>
    </Modal>
}