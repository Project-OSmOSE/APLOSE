import React, { Fragment, ReactNode } from 'react';
import { DangerTriangleLineDuotoneIcon } from '@solar-icons/react';
import styles from './ui.module.scss';
import { getErrorMessage } from '@/service/function';


export const WarningText: React.FC<{
    message?: string,
    error?: any,
    children?: ReactNode,
    className?: string
}> = ({ message, error, children, className }) => (
    <div className={ [ styles.warningText, className ].join(' ') }>
        <DangerTriangleLineDuotoneIcon size={ 24 }/>
        { message && <Fragment>{ message }</Fragment> }
        { message && (error || children) && <br/> }
        { error && <Fragment>{ getErrorMessage(error) }</Fragment> }
        { error && children && <br/> }
        { children }
    </div>
)

