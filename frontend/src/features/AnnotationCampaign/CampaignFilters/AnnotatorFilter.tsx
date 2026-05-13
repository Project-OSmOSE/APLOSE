import React, { useCallback } from 'react';
import { useCurrentUser } from '@/api';
import { useNavigate } from '@tanstack/react-router'
import { IonChip, IonIcon } from '@ionic/react';
import { closeCircle } from 'ionicons/icons';
import { Route } from '@/routes/_authenticated/annotation-campaign';

export const AnnotationCampaignAnnotatorFilter: React.FC = () => {
    const { filter_annotatorID } = Route.useSearch();
    const navigate = useNavigate();

    const { user } = useCurrentUser();

    const toggle = useCallback(() => {
        navigate({
            to: Route.to,
            search: (prev) => ({
                ...prev,
                filter_annotatorID: prev?.filter_annotatorID ? null : user?.id
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
