import React from 'react';
import { Dialog, type DialogTriggerProps as BaseProps } from '@base-ui/react/dialog';
import { Button, type ButtonProps } from '@/components/base/Button';

export type DialogTriggerProps = BaseProps & Pick<ButtonProps, 'color'>

export const Trigger: React.FC<DialogTriggerProps> = React.memo(({ color, render, ...props }) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Dialog.Trigger render={ render ? render : ({ color: _, ...props }) => <Button color={ color } { ...props }/> }
                    { ...props } />
))
