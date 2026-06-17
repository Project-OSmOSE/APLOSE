import React from 'react';
import { Dialog, type DialogTriggerProps as BaseProps } from '@base-ui/react/dialog';
import { Button, type ButtonProps } from '@/components/base/Button';

export type DialogTriggerProps = Omit<BaseProps, 'render'> & Pick<ButtonProps, 'color'>

export const Trigger: React.FC<DialogTriggerProps> = React.memo(({ color, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Dialog.Trigger render={ ({ color: _, ref, ...props }) => <Button color={ color } { ...props }/> }
                    { ...props } />
))
