import React, { Fragment } from 'react';
import { HelpLinearIcon } from '@solar-icons/react';
import { AnnotationCampaignNode } from "@/api/types.gql-generated.ts";
import { ExternalLink } from '@/components/base';

export const CampaignInstructionsButton: React.FC<{
    campaign: Pick<AnnotationCampaignNode, 'instructionsUrl'>
}> = ({ campaign: { instructionsUrl } }) => {
    if (!instructionsUrl) return <Fragment/>
    return <ExternalLink color="warning" href={ instructionsUrl } target="_blank">
        <HelpLinearIcon size={ 20 }/>
        Instructions
    </ExternalLink>
}