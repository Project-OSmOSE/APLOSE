import React, { useCallback } from 'react';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router'
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';

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

    return <IonChip outline={ !filter_annotatorID }
                    onClick={ toggle }
                    color={ filter_annotatorID ? 'primary' : 'medium' }>
        My work
        { filter_annotatorID && <IonIcon icon={ closeCircle } color="primary"/> }
    </IonChip>
}
