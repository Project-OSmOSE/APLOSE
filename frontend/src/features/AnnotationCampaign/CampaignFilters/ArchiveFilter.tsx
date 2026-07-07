import React, { useCallback, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Chip, ChipRemove } from '@/components/base/Chip';
import { SortHorizontal } from '@solar-icons/react';

export const AnnotationCampaignArchiveFilter: React.FC = () => {
    const filter_isArchived = useSearch({
        from: '/_authenticated/annotation-campaign/',
        select: ({ filter_isArchived }) => filter_isArchived,
    });
    const navigate = useNavigate();

    const exists = useMemo(() => filter_isArchived !== undefined && filter_isArchived !== null, [ filter_isArchived ])

    const toggle = useCallback(() => {
        navigate({
            to: '/annotation-campaign',
            search: (prev) => ({
                ...prev,
                filter_isArchived: prev?.filter_isArchived ? null : prev?.filter_isArchived === false,
            }),
            replace: true,
        })
    }, [ navigate ])

    return <Chip onClick={ toggle }
                 color={ exists ? 'primary' : 'medium' }>
        Archived{ exists && `: ${ filter_isArchived ? 'True' : 'False' }` }
        { filter_isArchived === false && <SortHorizontal weight="Linear" size={ 20 }/> }
        { filter_isArchived === true && <ChipRemove/> }
    </Chip>
}