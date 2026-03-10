import React, { Fragment, ReactNode, useMemo } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import styles from './ui.module.scss';
import { getErrorMessage } from '@/service/function';
import { CopyErrorStackButton } from '@/components/ui/Button';
import type { GqlError } from '@/api/baseGqlApi';

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
        <IoWarningOutline className={ styles.icon }/>
        { message && <Fragment>{ message }</Fragment> }
        { message && (error || children) && <br/> }
        { error && <Fragment>{ getErrorMessage(error) }</Fragment> }
        { error && children && <br/> }
        { children }
    </div>
)


export const GraphQLErrorText: React.FC<{
    error: GqlError,
    className?: string
}> = ({ error, className }) => {

    return useMemo(() => {
        className = [ styles.warningText, className ].join(' ')
        if (!error.messages) {
            return <div className={ className }>
                <IoWarningOutline className={ styles.icon }/>
                { error.statusErrorMessage }
            </div>
        }

        return <div className={ [ styles.warningText, className ].join(' ') }>
            <IoWarningOutline className={ styles.icon }/>
            { error.messages.map((m, k) => <Fragment key={ k }>{ m }</Fragment>) }
            <CopyErrorStackButton stack={ error.original } withLabel/>
        </div>
    }, [ error, className ])

}
