import React, { useMemo } from 'react';
import json from '../../../../global-package.json';
import styles from './Footer.module.scss';
import { DocumentationButton, ExternalLink, Link } from '@/components/base/Button';
import { GITHUB_URL, OSMOSE_URL } from '@/consts/links';
import { IonIcon, IonNote } from '@ionic/react';
import { logoGithub } from 'ionicons/icons';
import logo from '/images/ode_logo_192x192.png';
import { Note } from '@/components/base/Note';

export const Footer: React.FC<{ className?: string }> = React.memo(({ className }) => {
    const version = useMemo(() => json.version, [])

    return (
        <footer className={ [ styles.Footer, className ].join(' ') }>
            <div>
                <ExternalLink href={ GITHUB_URL } target="_blank">
                    <IonIcon icon={ logoGithub } slot="start"/>
                    Github
                </ExternalLink>
                <Note color="medium">{ version }</Note>
            </div>

            <ExternalLink href={ OSMOSE_URL } className={ styles.Owner }>
                OSmOSE <img src={ logo } alt="OSmOSE"/>
            </ExternalLink>

            <div>
                <DocumentationButton/>
                <IonNote color="medium">|</IonNote>
                <Link to="/terms">
                    Terms of use
                </Link>
            </div>
        </footer>
    );
});
