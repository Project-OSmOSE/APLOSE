import React, { Fragment, useCallback, useState } from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { closeOutline, menuOutline } from 'ionicons/icons/index.js';
import { useCurrentUser, useLogout } from '@/api';
import { DocumentationButton, Link } from '@/components/ui';
import styles from './layout.module.scss';
import logo from '/images/ode_logo_192x192.png';

export const Navbar: React.FC<{ className?: string }> = ({ className }) => {
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  const { logout } = useLogout()
  const { user } = useCurrentUser()

  const toggleOpening = useCallback(() => {
    setIsOpen(previous => !previous);
  }, [ setIsOpen ])

  const close = useCallback(() => setIsOpen(false), [ setIsOpen ])

  return (
    <div className={ [ styles.navbar, isOpen ? styles.opened : styles.closed, className ].join(' ') }>

      <div className={ styles.title }>
        <Link appPath="/annotation-campaign" onClick={ close }>
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
          <Link appPath="/annotation-campaign" onClick={ close }>
            Annotation campaigns
          </Link>
          { user?.isAdmin && <Fragment>
              <Link appPath="/dataset" onClick={ close }>Datasets</Link>
          </Fragment> }
        </div>

        { user?.isAdmin && <Fragment>
            <Link href="/backend/admin" target="_blank" color="medium">Admin</Link>
        </Fragment> }

        <DocumentationButton/>

        { user?.isSuperuser && <Link appPath="/admin/ontology/source" color="medium" onClick={ close }>Ontology</Link> }
        { user?.isSuperuser && <Link appPath="/admin/sql" color="medium" onClick={ close }>SQL query</Link> }

        <Link appPath="/account" color="medium" onClick={ close }>Account</Link>

        <IonButton className={ styles.logoutButton }
                   color={ 'medium' }
                   onClick={ () => logout() }>
          Logout
        </IonButton>
      </div>
    </div>)
}