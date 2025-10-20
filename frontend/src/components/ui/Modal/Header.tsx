import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import styles from './modal.module.scss';

export const ModalHeader: React.FC<{
  onClose?(): void;
  title: string;
}> = ({ onClose, title }) => (
  <div className={ styles.header }>
    <h3>{ title }</h3>
    <IoCloseOutline onClick={ onClose } className={ [ styles.icon, 'close' ].join(' ') } role="button"/>
    {/* 'close' classname is for playwright tests */ }
  </div>
)
