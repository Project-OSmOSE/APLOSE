import React from 'react';
import { Radio, RadioRootProps as BaseProps } from '@base-ui/react/radio';
import styles from './Toggle.module.scss'
import type { BaseColor } from '@/components/base/types';

export type RadioItemProps<T extends string = any> = BaseProps<T> & { color?: BaseColor }

export const Item: React.FC<RadioItemProps> = ({ className, ...props }) => (
    <Radio.Root className={ [ styles.Item, className ].join(' ') }
                { ...props }/>
)
