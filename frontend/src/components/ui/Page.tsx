import React, { ReactNode } from "react";
import styles from './ui.module.scss'
import { IonNote, IonSkeletonText } from "@ionic/react";
import { BackButton } from "@/components/ui/Button.tsx";

export const Head: React.FC<{
  title?: string;
  subtitle?: string | ReactNode;
  children?: ReactNode;
  buttons?: ReactNode;
  canGoBack?: boolean;
}> = ({ title, subtitle, children, buttons, canGoBack }) => {

  return <div className={ styles.head }>
    <div className={ styles.title }>
      <h2>{ title ?? <IonSkeletonText animated style={ { width: 256, height: '1ch', justifySelf: 'center' } }/> }</h2>
      { subtitle && <IonNote color='medium'>{ subtitle }</IonNote> }

      { canGoBack && <BackButton/> }
    </div>

    { children && <div className={ styles.content }>
      { children }
    </div> }

    { buttons && <div className={ styles.buttons }>
      { buttons }
    </div> }

  </div>
}