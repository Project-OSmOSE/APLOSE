import React, { Fragment } from 'react';
import { Button, type ButtonProps } from './Button';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router';
import styles from './Button.module.scss';

export type LinkProps =
    Omit<ButtonProps, 'onClick'>
    & Pick<LinkComponentProps, 'to' | 'params' | 'search' | 'preload' | 'replace'>
    & { inText?: boolean }

export const Link = React.forwardRef<HTMLAnchorElement, Omit<LinkProps, 'ref'>>(({
                                                                                     to,
                                                                                     params,
                                                                                     search,
                                                                                     preload,
                                                                                     replace,
                                                                                     inText,
                                                                                     children,
                                                                                     color,
                                                                                     ...props
                                                                                 }, ref) => (
    <RouterLink ref={ ref }
                to={ to }
                params={ params }
                search={ search }
                preload={ preload }
                replace={ replace }
                className={ [ styles.Link, inText ? styles.Text : '', styles[color ?? ''] ].join(' ') }>
        { inText ? <Fragment>{ children }</Fragment> : <Button color={ color } { ...props }>{ children }</Button> }
    </RouterLink>
))