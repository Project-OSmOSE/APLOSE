import React, { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { Button, Modal, ModalHeader } from '@/components/ui';
import { IonNote } from '@ionic/react';
import styles from './styles.module.scss';
import { useAnnotatorLabel } from './hooks';

export const UpdateLabelModal: React.FC<{
  isModalOpen: boolean,
  onClose: () => void,
  selected?: string,
  onUpdate: (label: string) => void;
}> = ({ isModalOpen, onClose, selected, onUpdate }) => {
  const { allLabels } = useAnnotatorLabel()
  if (!isModalOpen) return <Fragment/>
  return createPortal(<Modal onClose={ onClose }>
    <ModalHeader title="Update annotation label" onClose={ onClose }/>
    <IonNote>Choose a new label</IonNote>
    <div className={ styles.labelsButtons }>
      { allLabels.map((label, index) => <Button key={ label }
                                                fill="outline"
                                                disabled={ label === selected }
                                                className={ `ion-color-${ index % 10 }` }
                                                onClick={ () => {
                                                  onUpdate(label)
                                                  onClose()
                                                } }>
        { label }
      </Button>) }
    </div>
  </Modal>, document.body)
}