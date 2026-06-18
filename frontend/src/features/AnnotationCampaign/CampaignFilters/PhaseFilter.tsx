import React, { useCallback } from 'react';
import { AnnotationPhaseType } from '@/api';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Chip, ChipRemove } from '@/components/base/Chip';

export const AnnotationCampaignPhaseTypeFilter: React.FC = () => {
    const filter_phase = useSearch({
        from: '/_authenticated/annotation-campaign/',
        select: ({ filter_phase }) => filter_phase,
    });
    const navigate = useNavigate();

    const toggle = useCallback(() => {
        navigate({
            to: '/annotation-campaign',
            search: (prev) => ({
                ...prev,
                filter_phase: !prev?.filter_phase ? AnnotationPhaseType.Verification : null,
            }),
            replace: true,
        })
    }, [ navigate ])

    return <Chip onClick={ toggle }
                 color={ filter_phase === AnnotationPhaseType.Verification ? 'primary' : 'medium' }>
        Has verification
        { filter_phase === AnnotationPhaseType.Verification && <ChipRemove/> }
    </Chip>
}
