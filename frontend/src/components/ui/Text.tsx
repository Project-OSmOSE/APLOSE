import React, { Fragment, ReactNode, useCallback, useEffect, useMemo } from 'react';
import { IoWarningOutline } from 'react-icons/io5';
import styles from './ui.module.scss';
import { getErrorMessage } from '@/service/function';
import { Button } from '@/components/ui/Button';
import { IonIcon } from '@ionic/react';
import { copyOutline } from 'ionicons/icons';
import { useToast } from '@/components/ui/toast.hook';
import type { GqlError } from '@/api/baseGqlApi';

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


export const GraphQLErrorText: React.FC<{
    error: GqlError,
    className?: string
}> = ({ error, className }) => {
    const toast = useToast();

    useEffect(() => {
        console.log(error)
    }, [ error ]);

    const copy = useCallback(async () => {
        await navigator.clipboard.writeText(JSON.stringify(error.original))
        toast.presentSuccess(`Successfully copy original error into the clipboard`)
    }, [ toast, error ])

    return useMemo(() => {
        className = [ styles.warningText, className ].join(' ')
        if (!error.messages) {
            return <div className={className}>
                <IoWarningOutline className={ styles.icon }/>
                { error.statusErrorMessage }
            </div>
        }

        return <div className={ [ styles.warningText, className ].join(' ') }>
            <IoWarningOutline className={ styles.icon }/>
            { error.messages.map((m, k) => <Fragment key={ k }>{ m }</Fragment>) }
            <Button fill="clear" color="danger" size="small" onClick={ copy }>
                <IonIcon icon={ copyOutline } slot="start"/>
                Copy original error
            </Button>
        </div>
    }, [ error, className, copy ])

}
