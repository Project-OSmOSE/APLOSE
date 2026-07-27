import React from 'react';
import { Badge } from '@/components/base';
import type { DeploymentFragment } from './all.generated';

export const DeploymentStatusBadge: React.FC<Pick<DeploymentFragment, 'deploymentDate' | 'recoveryDate' | 'channelConfigurations'>> =
    React.memo(({ deploymentDate, recoveryDate, channelConfigurations }) => {
        if (!deploymentDate) return <Badge color="primary">Ready</Badge>
        if (recoveryDate) return <Badge color="success">Done</Badge>
        if (channelConfigurations.edges.some(e => !e?.node?.isLost))
            return <Badge color="warning">In progress</Badge>;
        return <Badge color="medium">Lost</Badge>
    })