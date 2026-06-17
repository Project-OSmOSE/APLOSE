import React from 'react';
import { Dialog, type DialogTitleProps as BaseProps } from '@base-ui/react/dialog';
import styles from './Dialog.module.scss';

export type DialogTitleProps = Omit<BaseProps, 'className'>

export const Title: React.FC<DialogTitleProps> = (props) => (
    <Dialog.Title className={ styles.Title }
                  { ...props } />
)
