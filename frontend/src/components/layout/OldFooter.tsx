import React, { useMemo } from 'react';
import { IonIcon, IonNote } from '@ionic/react';
import { Letter } from '@solar-icons/react';

import { CONTACT_MAIL, CONTACT_URI, GITHUB_URL, OSMOSE_URL } from '@/consts/links';
import { DocumentationButton, ExternalLink, Link } from '@/components/base/Button';

import { logoGithub } from 'ionicons/icons/index.js';
import logo from '/images/ode_logo_192x192.png';

import style from './layout.module.scss';
import json from '../../../global-package.json'


export const OldFooter: React.FC = () => {
    const version = useMemo(() => json.version, [])

    return (
        <footer className={ style.footer }>
            <div>
                <ExternalLink href={ GITHUB_URL } target="_blank">
                    <IonIcon icon={ logoGithub } slot="start"/>
                    Github
                </ExternalLink>
                <IonNote color="medium">{ version }</IonNote>
            </div>

            <div className={ style.proposition }>
                <p>Proposed by</p>
                <ExternalLink href={ OSMOSE_URL }>
                    OSmOSE <img src={ logo } alt="OSmOSE"/>
                </ExternalLink>
            </div>

            <div>
                <DocumentationButton/>
                <IonNote color="medium">|</IonNote>
                <Link to="/terms">
                    Terms of use
                </Link>
                <IonNote color="medium">|</IonNote>
                <ExternalLink href={ CONTACT_URI }>
                    <Letter/>
                    { CONTACT_MAIL }
                </ExternalLink>
            </div>
        </footer>
    );
};
