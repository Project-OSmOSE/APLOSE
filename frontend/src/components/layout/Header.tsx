import React, { ReactNode, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IonButton, IonIcon } from '@ionic/react';
import { closeOutline, menuOutline } from 'ionicons/icons';
import { DocumentationButton } from '@/components/ui';
import { useAppSelector } from '@/features';
import { selectCurrentUser } from '@/api';
import logo from '/images/ode_logo_192x192.png';
import styles from './layout.module.scss'

export const Header: React.FC<{
  buttons?: ReactNode;
  children?: ReactNode;
  size?: 'small' | 'default';
  canNavigate?: () => Promise<boolean>;
}> = ({ children, buttons, size, canNavigate }) => {

  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const currentUser = useAppSelector(selectCurrentUser)
  const navigate = useNavigate();

  const toggleOpening = useCallback(() => setIsOpen(previous => !previous), [])

  const onAPLOSEClick = useCallback(async () => {
    if (currentUser) {
      if (!canNavigate || await canNavigate()) {
        navigate(`/annotation-campaign/`);
      }
    } else {
      navigate(`/`);
    }
  }, [])

  return (
    <header
      className={ [ styles.header, isOpen ? styles.opened : styles.closed, size === 'small' ? styles.small : '', children ? styles.withInfo : '' ].join(' ') }>
      <div className={ styles.title } onClick={ onAPLOSEClick }>
        <img src={ logo } alt="OSmOSE"/>
        <h1>APLOSE</h1>
      </div>

      <IonButton fill="outline" color="medium"
                 className={ styles.toggle } onClick={ toggleOpening }>
        <IonIcon icon={ isOpen ? closeOutline : menuOutline } slot="icon-only"/>
      </IonButton>

      { children && <div className={ styles.info }>{ children }</div> }

      <div className={ styles.links }>
        <DocumentationButton size={ size }/>

        { buttons }

      </div>
    </header>
  )
}