import React, { Fragment } from 'react';
import { ExternalLink } from '@/components/base/Button';
import { Help } from '@solar-icons/react';

export const InstructionsButton: React.FC<{
    instructionsUrl?: string | null,
}> = ({ instructionsUrl }) => {
    if (!instructionsUrl) return <Fragment/>
    return <ExternalLink color="warning" href={ instructionsUrl } target="_blank">
        <Help weight="Linear" size={ 20 }/>
        Instructions
    </ExternalLink>
}