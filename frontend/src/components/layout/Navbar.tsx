import React, { Fragment, useCallback, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { closeOutline, menuOutline } from 'ionicons/icons/index.js';
import { useCurrentUser, useLogout } from '@/api';
import { Link } from '@/components/ui';
import styles from './layout.module.scss';
import logo from '/images/ode_logo_192x192.png';

export const Navbar: React.FC<{ className?: string }> = ({ className }) => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const [ logout ] = useLogout()
  const { user } = useCurrentUser()

  const toggleOpening = useCallback(() => {
    setIsOpen(previous => !previous);
  }, [ setIsOpen ])

  const close = useCallback(() => setIsOpen(false), [ setIsOpen ])

  return (
    <div className={ [ styles.navbar, isOpen ? styles.opened : styles.closed, className ].join(' ') }>

      <div className={ styles.title }>
        <Link appPath="/app/annotation-campaign" onClick={ close }>
          <img src={ logo } alt="APLOSE"/>
          <h1>APLOSE</h1>
        </Link>

        <IonButton fill="outline" color="medium"
                   className={ styles.toggle } onClick={ toggleOpening }>
          <IonIcon icon={ isOpen ? closeOutline : menuOutline } slot="icon-only"/>
        </IonButton>
      </div>

      <div className={ styles.navContent }>

        <div className={ styles.links }>
          <Link appPath="/app/annotation-campaign" onClick={ close }>
            Annotation campaigns
          </Link>
          { user?.isAdmin && <Fragment>
              <Link appPath="/app/dataset" onClick={ close }>Datasets</Link>
          </Fragment> }
          <Link appPath="/app/spectrogram-example" onClick={ close }>Spectrogram Example</Link>
          <Link appPath="/app/documentation" onClick={ close }>Documentation</Link>
          <Link appPath="/app/sound-library" onClick={ close }>Sound Library</Link>
        </div>

        { user?.isAdmin && <Fragment>
            <Link href="/backend/admin" target="_blank" color="medium">Admin</Link>
        </Fragment> }

        { user?.isSuperuser && <Link appPath="/app/admin/sql" color="medium" onClick={ close }>SQL query</Link> }

        <Link appPath="/app/account" color="medium" onClick={ close }>Account</Link>

        <Link href="/oceansound" color="medium" onClick={ close }>OceanSound</Link>

        <IonButton className={ styles.logoutButton }
                   color={ 'medium' }
                   onClick={ () => logout() }>
          Logout
        </IonButton>
      </div>
    </div>)
}