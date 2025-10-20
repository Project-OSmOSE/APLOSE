import React, { Fragment, ReactNode } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import styles from './ui.module.scss';
import { getErrorMessage } from '@/service/function';

export const FadedText: React.FC<{ children: ReactNode }> = ({ children }) => (
  <p className={ styles.fadedText }>{ children }</p>
)

export const WarningText: React.FC<{
  message?: string,
  error?: any,
  children?: ReactNode,
  className?: string
}> = ({ message, error, children, className }) => (
  <div className={ [ styles.warningText, className ].join(' ') }>
    <IoWarningOutline className={ styles.icon }/>
    { message && <Fragment>{ message }</Fragment> }
    { message && (error || children) && <br/> }
    { error && <Fragment>{ getErrorMessage(error) }</Fragment> }
    { error && children && <br/> }
    { children }
  </div>
)
