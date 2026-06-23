import React from 'react';
import { Dialog, type DialogTitleProps as BaseProps } from '@base-ui/react/dialog';
import styles from './Dialog.module.scss';
import type { BaseColor } from '@/components/base/types';

export type DialogTitleProps = Omit<BaseProps, 'className'> & {color?: BaseColor}

export const Title: React.FC<DialogTitleProps> = ({ color, ...props }) => (
    <Dialog.Title className={ [styles.Title, styles[color ?? '']].join(' ') }
                  { ...props } />
)
