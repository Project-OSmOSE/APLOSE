import React from 'react';
import { Popover, type PopoverTriggerProps as BaseProps } from '@base-ui/react/popover';
import styles from './Popover.module.scss';
import type { BaseColor } from '@/components/base/types';
import { Button, type ButtonProps, Link, type LinkProps } from '@/components/base/Button';

export type PopoverTriggerProps = BaseProps & { color?: BaseColor }

export const Trigger: React.FC<PopoverTriggerProps & ButtonProps> = React.memo(({ openOnHover, ...props }) => (
    <Popover.Trigger render={ ({ color, ...props }) => <Button color={ color as BaseColor } { ...props }/> }
                     className={ styles.Trigger }
                     openOnHover={ openOnHover === undefined ? true : openOnHover }
                     { ...props } />
))

export const TriggerLink: React.FC<PopoverTriggerProps & LinkProps> = React.memo(({ openOnHover, ...props }) => (
    <Popover.Trigger render={ ({ color, ...props }) => <Link color={ color as BaseColor } { ...props }/> }
                     nativeButton={ false }
                     className={ styles.Trigger }
                     openOnHover={ openOnHover === undefined ? true : openOnHover }
                     { ...props } />
))
