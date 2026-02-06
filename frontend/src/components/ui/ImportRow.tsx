import React, { ReactNode, useCallback } from 'react';
import styles from './ui.module.scss';
import { IonButton, IonSpinner } from '@ionic/react';
import { useToast } from '@/components/ui/toast.hook';

export const ImportRow: React.FC<{
    downloadedIcon: ReactNode;
    downloadIcon: ReactNode;
    isDownloaded?: boolean;
    isLoading: boolean;
    failedIcon?: ReactNode;
    isFailed?: boolean | null;
    errorStack?: string | null;
    name: string;
    path: string;
    doImport: () => void;
    children?: ReactNode
}> = ({
          isDownloaded,
          isLoading,
          downloadIcon,
          downloadedIcon,
          name,
          path,
          doImport,
          children,
          isFailed,
          errorStack,
          failedIcon,
      }) => {
    const toast = useToast();

    const copyStack = useCallback(async () => {
        if (!errorStack) return
        await navigator.clipboard.writeText(errorStack)
        toast.presentSuccess(`Error stacktrace has been copied into the clipboard`)
    }, [ errorStack ])

    return <div className={ [
        styles.importRow,
        isDownloaded ? styles.success : '',
        isFailed ? styles.error : '',
    ].join(' ') }>

        { isDownloaded ?
            <>{ downloadedIcon }</> :
            isLoading ?
                <IonSpinner/> :
                isFailed ?
                    <IonButton fill="clear" size="small" color='danger' onClick={ copyStack }>
                        { failedIcon }
                    </IonButton>
                    :
                    <IonButton fill="clear" size="small" onClick={ doImport }>
                        { downloadIcon }
                    </IonButton>
        }

        <span className={ isDownloaded ? 'disabled' : '' }>
      <b>{ name }</b>
      <p>{ path }</p>
    </span>

        { children }
    </div>
}