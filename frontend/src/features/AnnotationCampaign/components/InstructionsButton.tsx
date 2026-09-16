import React, { Fragment } from 'react';
import { HelpLinearIcon } from '@solar-icons/react';
import { ExternalLink } from '@/components/base/Button';

export const InstructionsButton: React.FC<{
    instructionsUrl?: string | null,
}> = ({ instructionsUrl }) => {
    if (!instructionsUrl) return <Fragment/>
    return <ExternalLink color="warning" href={ instructionsUrl } target="_blank">
        <HelpLinearIcon size={ 20 }/>
        Instructions
    </ExternalLink>
}