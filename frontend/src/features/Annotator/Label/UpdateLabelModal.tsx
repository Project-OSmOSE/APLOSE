import React from 'react';
import { Button, Modal, ModalHeader, type ModalProps } from '@/components/ui';
import { IonNote } from '@ionic/react';
import styles from './styles.module.scss';
import { useAppSelector } from '@/features/App';
import { selectAllLabels } from '@/features/Annotator/Label/selectors';

export const UpdateLabelModal: React.FC<ModalProps & {
  selected?: string,
  onUpdate: (label: string) => void;
}> = ({ onClose, selected, onUpdate }) => {
  console.log('open', selected)
  const allLabels = useAppSelector(selectAllLabels)
  return <Modal onClose={ onClose }>
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
  </Modal>
}