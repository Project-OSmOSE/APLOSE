import React, { useCallback } from 'react';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { Chip, ChipRemove } from '@/components/base/Chip';

export const AnnotationCampaignAnnotatorFilter: React.FC = () => {
    const filter_annotatorID = useSearch({
        from: '/_authenticated/annotation-campaign/',
        select: ({ filter_annotatorID }) => filter_annotatorID,
    });
    const navigate = useNavigate();

    const { user } = useLoaderData({ from: '/_authenticated' })

    const toggle = useCallback(() => {
        navigate({
            to: '/annotation-campaign',
            search: (prev) => ({
                ...prev,
                filter_annotatorID: prev?.filter_annotatorID ? null : user.id,
            }),
            replace: true,
        })
    }, [ user, navigate ])


    return <Chip onClick={ toggle }
                 color={ filter_annotatorID ? 'primary' : 'medium' }>
        My work
        { filter_annotatorID && <ChipRemove/> }
    </Chip>
}
