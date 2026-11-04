import React from 'react';
import { Drawer, type DrawerTriggerProps as BaseProps } from '@base-ui/react/drawer';
import { Button, ButtonProps } from '@/components/base/Button';

export type DrawerTriggerProps = Omit<BaseProps, 'render'> & ButtonProps

export const Trigger: React.FC<DrawerTriggerProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Drawer.Trigger render={ <Button/> } { ...props } />
))
