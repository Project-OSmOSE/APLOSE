import React, { Fragment } from 'react';
import styles from './form.module.scss';

export const Label: React.FC<{ label?: string, required?: boolean }> = ({ label, required }) => {
  if (!label) return <Fragment/>
  return <label htmlFor={ label }
                data-testid="label"
                className={ [ styles.label, required ? styles.required : '' ].join(' ') }>
    { label }{ required ? '*' : '' }
  </label>
}