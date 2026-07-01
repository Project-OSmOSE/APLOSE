import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Note, SkeletonText } from '@/components/base';
import styles from './modal.module.scss';

export const ModalHeader: React.FC<{
    onClose?(): void;
    title?: string;
    subtitle?: string;
}> = ({ onClose, title, subtitle }) => (
    <div className={ styles.header }>
        <h3>{ title ?? <SkeletonText width={ 256 }/> }</h3>
        { subtitle && <Note color="medium">{ subtitle }</Note> }

        <IoCloseOutline onClick={ onClose } data-testid="close-modal" className={ styles.icon } role="button"/>
    </div>
)
