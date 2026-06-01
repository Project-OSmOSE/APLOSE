import React, { useCallback } from 'react';
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign';
import { useLoaderData, useNavigate } from '@tanstack/react-router';

export const AnnotationCampaignOwnerFilter: React.FC = () => {
    const filter_ownerID = Route.useSearch({ select: ({ filter_ownerID }) => filter_ownerID });
    const navigate = useNavigate();

    const { user } = useLoaderData({ from: '/_authenticated' })

    const toggle = useCallback(() => {
        navigate({
            to: Route.to,
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
