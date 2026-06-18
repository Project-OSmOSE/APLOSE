import React from 'react';
import { Dialog, type DialogCloseProps as BaseProps } from '@base-ui/react/dialog';
import { Button } from '@/components/base/Button';
import type { BaseColor } from '@/components/base/types';

export type DialogCloseProps = Omit<BaseProps, 'render'> & { color?: BaseColor }

export const Close: React.FC<DialogCloseProps> = ({ color, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Dialog.Close render={ ({ color: _, ref, ...props }) => <Button color={ color } { ...props }/> }
                  { ...props }/>
)
