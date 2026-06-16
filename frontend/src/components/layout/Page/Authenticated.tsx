import React, { type ReactNode } from 'react';
import styles from './Page.module.scss'
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

export const Authenticated: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className={ [ styles.Page, styles.Authenticated ].join(' ') }>
        <Navigation.Authenticated className={ styles.Nav }/>
        <Navigation.AuthenticatedMobile className={ styles.NavMobile }/>
        { children }
        <Footer className={ styles.Footer }/>
    </div>
)