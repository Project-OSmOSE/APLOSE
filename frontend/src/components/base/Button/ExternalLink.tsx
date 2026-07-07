import React, { type AnchorHTMLAttributes, Fragment } from 'react';
import { Button, type ButtonProps } from './Button';
import { SquareTopDown } from '@solar-icons/react';
import { NBSP } from '@/service/type';
import styles from './Button.module.scss';

export type ExternalLinkProps =
    Omit<ButtonProps, 'onClick'>
    & Pick<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'href'>
    & { inText?: boolean }

export const ExternalLink: React.FC<ExternalLinkProps> = React.memo(({
                                                                         href,
                                                                         target,
                                                                         children,
                                                                         inText,
                                                                         rel,
                                                                         className,
                                                                         ...props
                                                                     }) => (
    <a href={ href } target={ target }
       rel={ rel ?? target === '_blank' ? 'noopener noreferrer' : undefined }
       className={ [ styles.ExternalLink, inText ? styles.Text : '', className ].join(' ') }>
        { inText ? <Fragment>
            { children }{ target === '_blank' && <Fragment>{ NBSP }<SquareTopDown weight="Linear"/></Fragment> }
        </Fragment> : <Button { ...props }>
            { children }{ target === '_blank' && <Fragment>{ NBSP }<SquareTopDown weight="Linear"/></Fragment> }
        </Button> }
    </a>
))
