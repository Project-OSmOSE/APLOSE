import React from 'react';
import { Button, Modal, ModalHeader, type ModalProps } from '@/components/ui';
import { IonNote } from '@ionic/react';
import styles from './styles.module.scss';
import { useLoaderData } from '@tanstack/react-router';

export const UpdateLabelModal: React.FC<ModalProps & {
  selected?: string,
  onUpdate: (label: string) => void;
}> = ({ onClose, selected, onUpdate }) => {
  const { labels } = useLoaderData({ from: '/_authenticated/annotation-campaign/$campaignID' })

  return <Modal onClose={ onClose }>
    <ModalHeader title="Update annotation label" onClose={ onClose }/>
    <IonNote>Choose a new label</IonNote>
    <div className={ styles.labelsButtons }>
      { labels.map((label, index) => <Button key={ label.id }
                                                fill="outline"
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