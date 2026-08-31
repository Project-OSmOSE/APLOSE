import React, { Fragment } from 'react';
import { AccessibilityEnum, type ProjectNode } from '@/api/types.gql-generated';
import { Badge } from '@/components/base';

export const ProjectAccessibilityBadge: React.FC<Pick<ProjectNode, 'accessibility'>> =
    React.memo(({ accessibility }) => {
        switch (accessibility) {
            case AccessibilityEnum.OpenAccess:
                return <Badge color="success">Open access</Badge>
            case AccessibilityEnum.UponRequest:
                return <Badge color="warning">Upon request</Badge>
            case AccessibilityEnum.Confidential:
                return <Badge color="danger">Confidential</Badge>
            default:
                return <Fragment/>
        }
    })