import React, { Fragment, ReactNode } from 'react';
import styles from './modal.module.scss';

export const ModalFooter: React.FC<{
  children?: ReactNode;
  className?: string;
}> = ({ children, className }) => {
  if (!children) return <Fragment/>
  return <div className={ [ styles.footer, className ].join(' ') }>{ children }</div>
}
