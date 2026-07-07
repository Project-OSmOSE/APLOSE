import React from 'react';
import type { UserNode } from '@/api';
import { Avatar as BaseAvatar } from '@/components/base/Avatar'

export const Avatar: React.FC<{ user: Pick<UserNode, 'displayName'> }> = ({ user }) => {
    return <BaseAvatar name={ user.displayName }/>
}