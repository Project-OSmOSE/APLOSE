import React, { type ReactNode } from 'react';
import styles from './Page.module.scss'
import { Navigation } from '../Navigation';
import { Footer } from '../Footer';

export const Public: React.FC<{ children: ReactNode }> = ({ children }) => (
    <div className={ [ styles.Page, styles.Public ].join(' ') }>
        <Navigation.Public/>
        <div className={ styles.Content }>
            { children }
        </div>
        <Footer/>
    </div>
)