import React, { ReactNode } from 'react';
import styles from './form.module.scss';

interface Props {
  label?: string;
  className?: string;
  children?: ReactNode
}

export const FormBloc: React.FC<Props> = ({ label, children, className }) => (
  <div className={ [ styles.formBloc, className ].join(' ') }>
    { label && <div className={ styles.separator }>
        <div></div>
      { label }
        <div></div>
    </div> }

    { children }
  </div>
)
