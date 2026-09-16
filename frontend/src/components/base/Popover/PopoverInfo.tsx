import React, { type ReactNode } from 'react';
import { InfoCircleLinearIcon } from '@solar-icons/react';
import { Content, Root, Trigger } from './index.parts'

export const PopoverInfo: React.FC<{ children: ReactNode }> = ({ children }) => (
    <Root>
        <Trigger>
            <InfoCircleLinearIcon size={ 16 }/>
        </Trigger>
        <Content>{ children }</Content>
    </Root>
)
