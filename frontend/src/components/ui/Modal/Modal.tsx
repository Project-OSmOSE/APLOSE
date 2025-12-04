import React from 'react';
import styles from './modal.module.scss';

export const Modal: React.FC<{
  onClose?(): void;
  className?: string;
  children: React.ReactNode;
}> = ({ onClose, children, className }) => (
  <div role="dialog"
       className={ styles.modalBackdrop }
       onClick={ onClose }>
    <div className={ [ styles.modal, className ].join(' ') } onClick={ e => e.stopPropagation() }>
      { children }
    </div>
  </div>
)
