import React from 'react';
import { Dialog, type DialogCloseProps as BaseProps } from '@base-ui/react/dialog';
import { Button, type ButtonProps } from '@/components/base/Button';

export type DialogCloseProps = Omit<BaseProps, 'render'> & ButtonProps

export const Close: React.FC<DialogCloseProps> = ({ color, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Dialog.Close render={ ({ color: _, ...props }) => <Button color={ color } { ...props }/> }
                  { ...props }/>
)
