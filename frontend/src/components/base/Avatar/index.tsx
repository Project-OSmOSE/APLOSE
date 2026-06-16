import React from 'react';
import { Avatar as BaseAvatar } from '@base-ui/react'
import styles from './Avatar.module.scss'

export const Avatar: React.FC<{ name: string }> = ({ name }) => {
    return <BaseAvatar.Root className={ styles.Avatar }>
        {
            name.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
        }
    </BaseAvatar.Root>
}

