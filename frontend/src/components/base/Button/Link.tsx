import React from 'react';
import { Button, type ButtonProps } from './Button';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router';
import styles from './Button.module.scss';

export type LinkProps =
    Omit<ButtonProps, 'onClick'>
    & Pick<LinkComponentProps, 'to' | 'params' | 'search' | 'preload' | 'replace'>

export const Link: React.FC<LinkProps> = React.memo(({ to, params, search, preload, replace, ...props }) => (
    <RouterLink to={ to } params={ params } search={ search } preload={ preload } replace={ replace }
                className={ styles.Link }>
        <Button { ...props }/>
    </RouterLink>
))
