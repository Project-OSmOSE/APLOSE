import React, { ReactNode } from 'react';
import styles from './ui.module.scss'

const BlocRoot: React.FC<{
    children: ReactNode,
    className?: string,
    'data-testid'?: string,
}> = ({ children, className, ['data-testid']: testID }) => {
    return <div className={ [ styles.bloc, className ].join(' ') }
                data-testid={ testID }>
        { children }
    </div>
}

const BlocTitle: React.FC<{
    children: ReactNode,
}> = ({ children }) => (
    <h5 className={ styles.header } children={ children }/>
)

const BlocContent: React.FC<{
    children: ReactNode,
    className?: string,
    center?: boolean,
    smallSpaces?: boolean,
    vertical?: boolean,
}> = ({ children, className, center, smallSpaces, vertical }) => {
    return <div className={ [
        styles.body,
        center ? styles.center : '',
        smallSpaces ? styles.smallSpaces : '',
        vertical ? styles.vertical : '',
        className,
    ].join(' ') }
                children={ children }/>
}

export const Bloc = {
    Root: BlocRoot,
    Title: BlocTitle,
    Content: BlocContent,
}
