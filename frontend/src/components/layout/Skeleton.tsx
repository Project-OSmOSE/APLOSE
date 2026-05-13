import React, { type ReactNode, useMemo } from 'react';
import { useSearch } from '@tanstack/react-router';

import { Footer } from './Footer';
import { Navbar } from './Navbar';

import styles from './layout.module.scss';

export const AploseSkeleton: React.FC<{
    children: ReactNode
}> = ({ children }) => {
    const looseSearch = useSearch({ strict: false })

    return useMemo(() => {
        if (looseSearch.spectrogramID) return children
        return (
            <div className={ styles.skeleton }>

                <Navbar className={ styles.navbar }/>

                <div className={ styles.content }>{ children }</div>

                <Footer/>
            </div>
        )
    }, [ children, looseSearch ])
}
