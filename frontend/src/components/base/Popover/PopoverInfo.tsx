import React, { type ReactNode } from 'react';
import { Content, Root, Trigger } from './index.parts'
import { InfoCircle } from '@solar-icons/react';

export const PopoverInfo: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Root>
        <Trigger>
            <InfoCircle weight="Linear" size={ 16 }/>
        </Trigger>
        <Content>{ children }</Content>
    </Root>
)
