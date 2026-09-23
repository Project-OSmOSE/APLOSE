import React from 'react';
import { Avatar as BaseAvatar } from '@/components/base/Avatar'
import * as API from '../api'

export const Avatar: React.FC<{ user: Pick<API.Fragment, 'displayName'> }> = ({ user }) => {
    return <BaseAvatar name={ user.displayName }/>
}
