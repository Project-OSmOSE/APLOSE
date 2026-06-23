import React from 'react';
import { Drawer, type DrawerCloseProps as BaseProps } from '@base-ui/react/drawer';
import { Button } from '@/components/base/Button';
import { CloseSquare } from '@solar-icons/react';

export type DrawerCloseProps = Omit<BaseProps, 'render' | 'children'>

export const Close: React.FC<DrawerCloseProps> = React.memo((props) => (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    <Drawer.Close render={ ({ color, ...props }) => <Button { ...props }/> }
                  children={ <CloseSquare weight="Linear" size={ 24 }/> }
                  { ...props }/>
))
