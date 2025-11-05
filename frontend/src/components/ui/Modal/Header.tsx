import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import styles from './modal.module.scss';
import { IonNote, IonSkeletonText } from '@ionic/react';

export const ModalHeader: React.FC<{
  onClose?(): void;
  title?: string;
  subtitle?: string;
}> = ({ onClose, title, subtitle }) => (
  <div className={ styles.header }>
    <h3>{ title ?? <IonSkeletonText animated style={ { width: 256, height: '1ch', justifySelf: 'center' } }/> }</h3>
    { subtitle && <IonNote color="medium">{ subtitle }</IonNote> }

    <IoCloseOutline onClick={ onClose } data-testid="close-modal" className={ styles.icon } role="button"/>
  </div>
)
