import React, { useMemo } from 'react';
import { IonIcon, IonNote } from '@ionic/react';
import { logoGithub } from 'ionicons/icons/index.js';
import { Link } from '@/components/ui';
import { GITHUB_URL } from '@/consts/links';
import style from './layout.module.scss';

export const Footer: React.FC = () => {
  const version = useMemo(() => import.meta.env.VITE_GIT_TAG, [])

  return (
    <footer className={ style.footer }>
      <div>
        <Link href={ GITHUB_URL } target="_blank" color="medium">
          <IonIcon icon={ logoGithub } slot="start"/>
          Github
        </Link>
        <IonNote color="medium">{ version }</IonNote>
      </div>

      <div></div>
    </footer>
  );
};
