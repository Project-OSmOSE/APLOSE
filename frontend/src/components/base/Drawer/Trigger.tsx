import React from 'react';
import { Drawer, type DrawerTriggerProps as BaseProps } from '@base-ui/react/drawer';
import { Button } from '@/components/base/Button';

export type DrawerTriggerProps = Omit<BaseProps, 'render'>

export const Trigger: React.FC<DrawerTriggerProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Drawer.Trigger render={ ({ color, ref, ...props }) => <Button { ...props }/> }
                            { ...props } />
))
