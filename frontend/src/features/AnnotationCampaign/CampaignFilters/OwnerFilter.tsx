import React, { useCallback } from 'react';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';
import { Chip, ChipRemove } from '@/components/base/Chip';

export const AnnotationCampaignOwnerFilter: React.FC = () => {
    const filter_ownerID = useSearch({
        from: '/_authenticated/annotation-campaign/',
        select: ({ filter_ownerID }) => filter_ownerID,
    });
    const navigate = useNavigate();

    const { user } = useLoaderData({ from: '/_authenticated' })

    const toggle = useCallback(() => {
        navigate({
            to: '/annotation-campaign',
            search: (prev) => ({
                ...prev,
                filter_ownerID: prev?.filter_ownerID ? null : user.id,
            }),
            replace: true,
        })
    }, [ navigate, user ])

    return <Chip onClick={ toggle }
                 color={ filter_ownerID ? 'primary' : 'medium' }>
        Owned campaigns
        { filter_ownerID && <ChipRemove/> }
    </Chip>
}
