import React, { ReactNode } from "react";
import styles from "./ui.module.scss";
import { IonButton, IonSpinner } from "@ionic/react";

export const ImportRow: React.FC<{
  downloadedIcon: ReactNode;
  downloadIcon: ReactNode;
  isDownloaded?: boolean;
  isLoading: boolean;
  name: string;
  path: string;
  doImport: () => void;
  children?: ReactNode
}> = ({ isDownloaded, isLoading, downloadIcon, downloadedIcon, name, path, doImport, children }) => {
  return <div className={ [ styles.importRow, isDownloaded ? styles.success : '' ].join(' ') }>

    { isDownloaded ?
      <>{ downloadedIcon }</> :
      isLoading ?
        <IonSpinner/> :
        <IonButton fill='clear' size='small' onClick={ doImport }>
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