import React, { Fragment, ReactNode } from 'react';
import styles from './ui.module.scss';
import { getErrorMessage } from '@/service/function';
import { DangerTriangle } from '@solar-icons/react';

export const FadedText: React.FC<{ children: ReactNode }> = ({ children }) => (
    <span className={ styles.fadedText }>{ children }</span>
)

export const WarningText: React.FC<{
    message?: string,
    error?: any,
    children?: ReactNode,
    className?: string
}> = ({ message, error, children, className }) => (
    <div className={ [ styles.warningText, className ].join(' ') }>
        <DangerTriangle weight="LineDuotone" size={ 24 }/>
        { message && <Fragment>{ message }</Fragment> }
        { message && (error || children) && <br/> }
        { error && <Fragment>{ getErrorMessage(error) }</Fragment> }
        { error && children && <br/> }
        { children }
    </div>
)

