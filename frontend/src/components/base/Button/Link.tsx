import React, { Fragment } from 'react';
import { Button, type ButtonProps } from './Button';
import { Link as RouterLink, type LinkComponentProps } from '@tanstack/react-router';
import styles from './Button.module.scss';
import { NBSP } from "@/service/type.ts";
import { SquareTopDownLinearIcon } from "@solar-icons/react";

export type LinkProps =
    Omit<ButtonProps, 'onClick'>
    & Pick<LinkComponentProps, 'to' | 'params' | 'search' | 'preload' | 'replace' | 'target'>
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
                                                                                     target,
                                                                                     ...props
                                                                                 }, ref) => (
    <RouterLink ref={ ref }
                to={ to }
                params={ params }
                search={ search }
                preload={ preload }
                replace={ replace }
                target={ target }
                className={ [ styles.Link, inText ? styles.Text : '', styles[color ?? ''] ].join(' ') }>
        { inText
            ? <Fragment>
                { children }
                { target === '_blank' && <Fragment>{ NBSP }<SquareTopDownLinearIcon/></Fragment> }
            </Fragment>
            : <Button color={ color } { ...props }>
                { children }
                { target === '_blank' && <Fragment>{ NBSP }<SquareTopDownLinearIcon/></Fragment> }
            </Button> }
    </RouterLink>
))