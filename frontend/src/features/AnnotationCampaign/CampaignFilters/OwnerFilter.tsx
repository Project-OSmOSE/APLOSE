import React, { useCallback } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { useLoaderData, useNavigate, useSearch } from '@tanstack/react-router';

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

    return <IonChip outline={ !filter_ownerID }
                    onClick={ toggle }
                    color={ filter_ownerID ? 'primary' : 'medium' }>
        Owned campaigns
        { filter_ownerID && <IonIcon icon={ closeCircle } color="primary"/> }
    </IonChip>
}
